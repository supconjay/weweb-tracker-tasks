<template>
  <div class="pp-root" :class="themeClass" :style="rootStyle">
    <div class="pp-card">
      <!-- Header -->
      <div v-if="content.showHeader !== false" class="pp-head">
        <div class="pp-head__left">
          <h3 class="pp-head__title">{{ content.title }}</h3>
          <span v-if="content.showCount !== false" class="pp-count">{{ tasks.length }}</span>
        </div>
        <button
          v-if="content.showAddItem === true"
          type="button"
          class="pp-btn pp-btn--primary"
          @click="emitAddItem"
        >
          <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('plus')"></path></svg>
          <span>{{ content.addItemLabel || 'Add Item' }}</span>
        </button>
      </div>

      <p v-if="content.intro" class="pp-intro">{{ content.intro }}</p>

      <!-- Top pager -->
      <div v-if="paginationActive && content.pagerTop !== false" class="pp-pager pp-pager--top">
        <button class="pp-pager__btn" type="button" :disabled="page <= 1" aria-label="Previous page" @click="goPage(page - 1)">
          <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('chevron-left')"></path></svg>
        </button>
        <button
          v-for="(p, i) in pageWindow"
          :key="'t' + i"
          type="button"
          class="pp-pager__num"
          :class="{ 'pp-pager__num--active': p === page, 'pp-pager__num--gap': p === '…' }"
          :disabled="p === '…'"
          @click="p !== '…' && goPage(p)"
        >{{ p }}</button>
        <button class="pp-pager__btn" type="button" :disabled="page >= totalPages" aria-label="Next page" @click="goPage(page + 1)">
          <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('chevron-right')"></path></svg>
        </button>
      </div>

      <!-- Empty -->
      <div v-if="!tasks.length" class="pp-empty">
        <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('clipboard')"></path></svg>
        <span>{{ content.emptyListText || 'No tasks to display' }}</span>
      </div>

      <!-- Task list -->
      <ul v-else class="pp-list">
        <li
          v-for="(t, i) in pagedTasks"
          :key="taskId(t) || (pageOffset + i)"
          class="pp-task"
          :class="'pp-task--' + completeState(t)"
        >
          <!-- Status icon -->
          <div class="pp-task__status" :class="'pp-task__status--' + completeState(t)">
            <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic(statusIcon(t))"></path></svg>
          </div>

          <!-- Body -->
          <div class="pp-task__body">
            <div class="pp-task__top">
              <span class="pp-task__num">{{ taskLabel(t, pageOffset + i) }}</span>
              <span v-if="categoryText(t)" class="pp-chip">{{ categoryText(t) }}</span>
              <span
                v-if="isComplete(t) && completionDateText(t)"
                class="pp-done"
              >
                <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('check-circle')"></path></svg>
                {{ content.completedPrefix || 'Completed' }} {{ completionDateText(t) }}
              </span>
            </div>

            <p v-if="descriptionText(t)" class="pp-task__desc">{{ descriptionText(t) }}</p>

            <div v-if="locationText(t)" class="pp-task__loc">
              <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('pin')"></path></svg>
              <span>{{ locationText(t) }}</span>
            </div>

            <!-- Financials -->
            <div v-if="content.showFinancials !== false && (laborVal(t) !== '' || materialVal(t) !== '')" class="pp-stats">
              <span v-if="laborVal(t) !== ''" class="pp-stat">
                <span class="pp-stat__ico"><svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('dollar')"></path></svg></span>
                <span class="pp-stat__label">{{ content.laborLabel || 'Labor' }}</span>
                <span class="pp-stat__value">{{ money(laborVal(t)) }}</span>
              </span>
              <span v-if="materialVal(t) !== ''" class="pp-stat">
                <span class="pp-stat__ico"><svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('box')"></path></svg></span>
                <span class="pp-stat__label">{{ content.materialLabel || 'Material' }}</span>
                <span class="pp-stat__value">{{ money(materialVal(t)) }}</span>
              </span>
            </div>

            <!-- Photos -->
            <div v-if="content.showPhotos !== false" class="pp-photos">
              <div class="pp-photogrp">
                <span class="pp-photogrp__label">
                  <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('image')"></path></svg>
                  {{ content.beforeLabel || 'Before' }}
                  <span v-if="beforePhotos(t).length" class="pp-count pp-count--sm">{{ beforePhotos(t).length }}</span>
                </span>
                <span v-if="!beforePhotos(t).length" class="pp-photogrp__none">{{ content.photosEmptyText || 'No photos' }}</span>
                <div v-else class="pp-thumbs">
                  <button
                    v-for="(p, j) in beforePhotos(t).slice(0, photoMax)"
                    :key="'b' + j"
                    type="button"
                    class="pp-thumb"
                    @click="emitPhoto(t, 'before', j, p)"
                  >
                    <img v-if="photoThumb(p)" :src="photoThumb(p)" :alt="'Before ' + (j + 1)" />
                    <svg v-else class="pp-svg" v-bind="svgAttrs"><path :d="ic('image')"></path></svg>
                  </button>
                  <button
                    v-if="beforePhotos(t).length > photoMax"
                    type="button"
                    class="pp-thumb pp-thumb--more"
                    @click="emitPhoto(t, 'before', photoMax, beforePhotos(t)[photoMax])"
                  >+{{ beforePhotos(t).length - photoMax }}</button>
                </div>
              </div>

              <div class="pp-photogrp">
                <span class="pp-photogrp__label">
                  <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('image')"></path></svg>
                  {{ content.afterLabel || 'Completion' }}
                  <span v-if="afterPhotos(t).length" class="pp-count pp-count--sm">{{ afterPhotos(t).length }}</span>
                </span>
                <span v-if="!afterPhotos(t).length" class="pp-photogrp__none">{{ content.photosEmptyText || 'No photos' }}</span>
                <div v-else class="pp-thumbs">
                  <button
                    v-for="(p, j) in afterPhotos(t).slice(0, photoMax)"
                    :key="'a' + j"
                    type="button"
                    class="pp-thumb"
                    @click="emitPhoto(t, 'after', j, p)"
                  >
                    <img v-if="photoThumb(p)" :src="photoThumb(p)" :alt="'Completion ' + (j + 1)" />
                    <svg v-else class="pp-svg" v-bind="svgAttrs"><path :d="ic('image')"></path></svg>
                  </button>
                  <button
                    v-if="afterPhotos(t).length > photoMax"
                    type="button"
                    class="pp-thumb pp-thumb--more"
                    @click="emitPhoto(t, 'after', photoMax, afterPhotos(t)[photoMax])"
                  >+{{ afterPhotos(t).length - photoMax }}</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Open -->
          <button v-if="content.showOpen !== false" type="button" class="pp-open" @click="emitOpen(t, pageOffset + i)">
            <span>{{ content.openLabel || 'Open' }}</span>
            <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('chevron-right')"></path></svg>
          </button>
        </li>
      </ul>

      <!-- Bottom pager -->
      <div v-if="paginationActive && content.pagerBottom !== false" class="pp-pager">
        <button class="pp-pager__btn" type="button" :disabled="page <= 1" aria-label="Previous page" @click="goPage(page - 1)">
          <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('chevron-left')"></path></svg>
        </button>
        <button
          v-for="(p, i) in pageWindow"
          :key="'b' + i"
          type="button"
          class="pp-pager__num"
          :class="{ 'pp-pager__num--active': p === page, 'pp-pager__num--gap': p === '…' }"
          :disabled="p === '…'"
          @click="p !== '…' && goPage(p)"
        >{{ p }}</button>
        <button class="pp-pager__btn" type="button" :disabled="page >= totalPages" aria-label="Next page" @click="goPage(page + 1)">
          <svg class="pp-svg" v-bind="svgAttrs"><path :d="ic('chevron-right')"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const ICONS = {
  plus: "M12 5v14M5 12h14",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  "check-circle": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8.5 12l2.5 2.5L16 9",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 7v5l3.5 2",
  circle: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  clipboard: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
  dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  box: "M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8",
  image: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21",
  pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
};

export default {
  props: { content: { type: Object, required: true }, uid: { type: String, required: false } },
  emits: ["trigger-event"],
  data() {
    return { page: 1 };
  },
  watch: {
    taskCount(n) {
      const tp = Math.max(1, Math.ceil(n / this.pageSize));
      if (this.page > tp) this.page = tp;
    },
  },
  computed: {
    tasks() {
      const raw = this.content.tasks;
      if (Array.isArray(raw)) return raw;
      if (raw && typeof raw === "object") {
        if (Array.isArray(raw.data)) return raw.data;
        if (Array.isArray(raw.items)) return raw.items;
      }
      return [];
    },
    taskCount() { return this.tasks.length; },
    pageSize() { const n = Number(this.content.pageSize); return n > 0 ? Math.floor(n) : 10; },
    paginationActive() { return this.content.paginate !== false && this.totalPages > 1; },
    totalPages() { return Math.max(1, Math.ceil(this.taskCount / this.pageSize)); },
    pageOffset() { return this.content.paginate === false ? 0 : (this.page - 1) * this.pageSize; },
    pagedTasks() {
      if (this.content.paginate === false) return this.tasks;
      return this.tasks.slice(this.pageOffset, this.pageOffset + this.pageSize);
    },
    photoMax() { const n = Number(this.content.photoMax); return n > 0 ? Math.floor(n) : 4; },
    pageWindow() {
      const total = this.totalPages;
      const cur = this.page;
      if (total <= 7) {
        const out = [];
        for (let i = 1; i <= total; i++) out.push(i);
        return out;
      }
      const out = [1];
      const start = Math.max(2, cur - 1);
      const end = Math.min(total - 1, cur + 1);
      if (start > 2) out.push("…");
      for (let i = start; i <= end; i++) out.push(i);
      if (end < total - 1) out.push("…");
      out.push(total);
      return out;
    },
    svgAttrs() {
      return { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" };
    },
    themeClass() {
      const m = this.content.darkMode || "auto";
      return { "pp-auto": m === "auto", "pp-dark": m === "dark", "pp-light": m === "light" };
    },
    rootStyle() {
      return {
        "--pp-primary": this.content.primaryColor || "#10b981",
        "--pp-accent": this.content.accentColor || "#6366f1",
        "--pp-radius": (this.content.radius != null ? this.content.radius : 16) + "px",
      };
    },
  },
  methods: {
    ic(name) { return ICONS[name] || ""; },
    str(v) { return v == null ? "" : String(v); },
    firstOf(v) {
      if (Array.isArray(v)) return v.length ? v[0] : "";
      return v;
    },
    fieldVal(obj, key, fallbacks) {
      if (!obj) return undefined;
      if (key && obj[key] != null && obj[key] !== "") return obj[key];
      for (let i = 0; i < (fallbacks || []).length; i++) {
        const k = fallbacks[i];
        if (obj[k] != null && obj[k] !== "") return obj[k];
      }
      return undefined;
    },
    taskId(t) {
      const v = this.fieldVal(t, this.content.idField, ["id", "_id", "uuid", "key"]);
      return v != null ? v : "";
    },
    taskNumber(t) {
      const v = this.fieldVal(t, this.content.taskNumberField, ["Task Number", "task_number", "number"]);
      return v == null || v === "" ? null : v;
    },
    taskLabel(t, idx) {
      const n = this.taskNumber(t);
      const prefix = this.content.taskPrefix != null ? this.content.taskPrefix : "Task";
      return (prefix ? prefix + " " : "") + (n != null ? n : idx + 1);
    },
    categoryText(t) {
      return this.str(this.firstOf(this.fieldVal(t, this.content.categoryField, ["Name (from Category)", "category", "Category"])));
    },
    descriptionText(t) {
      return this.str(this.fieldVal(t, this.content.descriptionField, ["Tech Description", "Description", "description"]));
    },
    locationText(t) {
      return this.str(this.firstOf(this.fieldVal(t, this.content.locationField, ["location_name", "Name (from Locations)", "location"])));
    },
    isComplete(t) {
      const v = this.fieldVal(t, this.content.completeField, ["Complete", "complete", "completed"]);
      return v === true || v === "true" || v === 1;
    },
    completeState(t) {
      const v = t ? (this.content.completeField && t[this.content.completeField] !== undefined ? t[this.content.completeField] : (t.Complete !== undefined ? t.Complete : undefined)) : undefined;
      if (v === true || v === "true" || v === 1) return "done";
      if (v === false || v === "false" || v === 0) return "pending";
      return "none";
    },
    statusIcon(t) {
      const s = this.completeState(t);
      if (s === "done") return "check-circle";
      if (s === "pending") return "clock";
      return "circle";
    },
    completionDateText(t) {
      const raw = this.fieldVal(t, this.content.completionDateField, ["completion_date", "completed_at", "completedAt"]);
      if (!raw) return "";
      const d = new Date(raw);
      if (isNaN(d)) return this.str(raw);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    },
    laborVal(t) { const v = this.fieldVal(t, this.content.laborField, ["Labor Cost", "labor", "labor_cost"]); return v == null ? "" : v; },
    materialVal(t) { const v = this.fieldVal(t, this.content.materialField, ["Material Cost", "material", "material_cost"]); return v == null ? "" : v; },
    money(v) {
      if (v === "" || v == null) return "";
      const n = Number(v);
      const prefix = this.content.currencyPrefix != null ? this.content.currencyPrefix : "$";
      if (isNaN(n)) return this.str(v);
      return prefix + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
    },
    photoArr(t, key, fallbacks) {
      let arr = this.fieldVal(t, key, fallbacks);
      if (Array.isArray(arr)) return arr;
      if (arr && typeof arr === "object" && Array.isArray(arr.data)) return arr.data;
      return [];
    },
    beforePhotos(t) { return this.photoArr(t, this.content.beforePhotosField, ["Before Photos", "before_photos", "beforePhotos"]); },
    afterPhotos(t) { return this.photoArr(t, this.content.afterPhotosField, ["Completion Photos", "completion_photos", "afterPhotos"]); },
    thumbUrl(obj) {
      if (!obj) return "";
      if (typeof obj === "string") return obj;
      const t = obj.thumbnails;
      if (t && typeof t === "object") {
        const size = this.content.thumbnailSize || "small";
        const order = size === "small" ? ["small", "large", "full"]
          : size === "full" ? ["full", "large", "small"]
          : ["large", "small", "full"];
        for (let i = 0; i < order.length; i++) {
          const k = order[i];
          if (t[k] && t[k].url) return t[k].url;
        }
      }
      return obj.thumbnail_url || obj.thumbnailUrl || obj.thumbnail || obj.url || obj.src || obj.image || "";
    },
    photoThumb(p) { return this.thumbUrl(p); },
    photoUrl(p) {
      if (!p) return "";
      if (typeof p === "string") return p;
      return p.url || p.src || p.image || p.thumbnail_url || "";
    },
    attType(att) { return (att && (att.content_type || att.contentType || att.type)) || ""; },
    attName(att) {
      if (!att) return "File";
      if (typeof att === "string") { const u = att.split("?")[0]; return u.substring(u.lastIndexOf("/") + 1) || "File"; }
      if (att.name || att.filename) return att.name || att.filename;
      const u = (att.url || "").toString().split("?")[0];
      return u.substring(u.lastIndexOf("/") + 1) || "File";
    },
    isImage(att) {
      if (!att) return false;
      const ct = (att.content_type || att.contentType || att.type || "").toLowerCase();
      if (ct) return ct.indexOf("image/") === 0;
      const u = (att.url || att || "").toString().toLowerCase();
      return /\.(png|jpe?g|gif|webp|svg|bmp|avif|heic)(\?|#|$)/.test(u);
    },
    // ---- interactions ----
    goPage(p) {
      const next = Math.max(1, Math.min(this.totalPages, p));
      if (next === this.page) return;
      this.page = next;
      this.$emit("trigger-event", { name: "pageChange", event: { page: next } });
    },
    emitAddItem() {
      this.$emit("trigger-event", { name: "addItem", event: {} });
    },
    emitOpen(t, index) {
      this.$emit("trigger-event", { name: "openTask", event: { id: this.taskId(t) || "", index, task: t || {} } });
    },
    emitPhoto(t, group, index, p) {
      const photos = group === "before" ? this.beforePhotos(t) : this.afterPhotos(t);
      this.$emit("trigger-event", {
        name: "photoClick",
        event: {
          group,
          index,
          url: this.photoUrl(p),
          type: this.attType(p),
          filename: this.attName(p),
          isImage: this.isImage(p),
          photo: p || {},
          photos: Array.isArray(photos) ? photos.slice() : [],
          taskId: this.taskId(t) || "",
          task: t || {},
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pp-root {
  --surface: #ffffff; --surface-2: #f7f9fc; --surface-3: #eef2f7; --border: #e4e9f0; --border-strong: #d4dbe6;
  --text: #1f2a37; --text-muted: #64748b; --text-subtle: #94a3b8;
  --shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.06);
  --shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
  --ok: #10b981; --info: #3b82f6; --warn: #f59e0b; --danger: #ef4444;
  --accent: var(--pp-accent, #6366f1); --primary: var(--pp-primary, #10b981); --radius: var(--pp-radius, 16px);
  box-sizing: border-box; width: 100%; max-width: 100%; color: var(--text);
  container-type: inline-size;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.45;
}
.pp-root *, .pp-root *::before, .pp-root *::after { box-sizing: border-box; }
@mixin dark {
  --surface: #161f30; --surface-2: #1b2638; --surface-3: #202c40; --border: #28344a; --border-strong: #34425c;
  --text: #e8eef7; --text-muted: #94a3b8; --text-subtle: #64748b;
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 12px 28px rgba(0, 0, 0, 0.35);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.pp-root.pp-dark { @include dark; }
@media (prefers-color-scheme: dark) { .pp-root.pp-auto { @include dark; } }

.pp-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); padding: clamp(16px, 2.4vw, 22px); }

/* Header */
.pp-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
.pp-head__left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.pp-head__title { margin: 0; font-size: 17px; font-weight: 700; color: var(--text); }
.pp-count { display: inline-grid; place-items: center; min-width: 22px; height: 22px; padding: 0 7px; border-radius: 999px; background: var(--surface-3); color: var(--text-muted); font-size: 12px; font-weight: 700; }
.pp-count--sm { min-width: 18px; height: 18px; font-size: 11px; }
.pp-intro { margin: 4px 0 2px; color: var(--text-muted); font-size: 13px; }

.pp-btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 14px; border-radius: 10px; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: filter .15s, background .15s, border-color .15s; }
.pp-btn .pp-svg { width: 16px; height: 16px; }
.pp-btn--primary { background: var(--primary); color: #fff; }
.pp-btn--primary:hover { filter: brightness(1.05); }

/* List */
.pp-list { list-style: none; margin: 16px 0 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.pp-task { display: flex; gap: 14px; padding: 16px; border: 1px solid var(--border); border-radius: 14px; background: var(--surface-2); transition: border-color .15s, box-shadow .15s; }
.pp-task:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
.pp-task--done { background: color-mix(in srgb, var(--ok) 5%, var(--surface-2)); }

.pp-task__status { flex: none; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: var(--surface-3); color: var(--text-subtle); }
.pp-task__status .pp-svg { width: 22px; height: 22px; }
.pp-task__status--done { background: color-mix(in srgb, var(--ok) 15%, transparent); color: var(--ok); }
.pp-task__status--pending { background: color-mix(in srgb, var(--info) 13%, transparent); color: var(--info); }

.pp-task__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.pp-task__top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.pp-task__num { font-size: 15px; font-weight: 700; color: var(--text); }
.pp-chip { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; background: color-mix(in srgb, var(--accent) 12%, transparent); color: var(--accent); font-size: 12px; font-weight: 600; }
.pp-done { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; background: color-mix(in srgb, var(--ok) 12%, transparent); color: var(--ok); font-size: 12px; font-weight: 600; }
.pp-done .pp-svg { width: 14px; height: 14px; }

.pp-task__desc { margin: 0; color: var(--text-muted); font-size: 13.5px; white-space: pre-wrap; overflow-wrap: anywhere; }
.pp-task__loc { display: inline-flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 13px; font-weight: 500; }
.pp-task__loc .pp-svg { width: 15px; height: 15px; color: var(--text-subtle); }

.pp-stats { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px; }
.pp-stat { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px 6px 8px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
.pp-stat__ico { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 7px; background: color-mix(in srgb, var(--primary) 13%, transparent); color: var(--primary); flex: none; }
.pp-stat__ico .pp-svg { width: 15px; height: 15px; }
.pp-stat__label { color: var(--text-muted); font-size: 12.5px; font-weight: 600; }
.pp-stat__value { font-size: 13.5px; font-weight: 700; color: var(--text); }

.pp-photos { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 4px; }
.pp-photogrp { display: flex; flex-direction: column; gap: 6px; }
.pp-photogrp__label { display: inline-flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 12px; font-weight: 600; }
.pp-photogrp__label .pp-svg { width: 14px; height: 14px; color: var(--text-subtle); }
.pp-photogrp__none { color: var(--text-subtle); font-size: 12.5px; font-style: italic; }
.pp-thumbs { display: flex; flex-wrap: wrap; gap: 6px; }
.pp-thumb { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 9px; overflow: hidden; border: 1px solid var(--border); background: var(--surface-3); color: var(--text-subtle); cursor: pointer; padding: 0; transition: border-color .15s, transform .12s; }
.pp-thumb:hover { border-color: var(--border-strong); transform: translateY(-1px); }
.pp-thumb img { width: 100%; height: 100%; object-fit: cover; }
.pp-thumb .pp-svg { width: 18px; height: 18px; }
.pp-thumb--more { font-size: 12.5px; font-weight: 700; color: var(--text-muted); background: var(--surface); }

.pp-open { flex: none; align-self: flex-start; display: inline-flex; align-items: center; gap: 5px; padding: 8px 12px; border: 1px solid var(--border-strong); border-radius: 10px; background: var(--surface); color: var(--text); font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
.pp-open:hover { background: color-mix(in srgb, var(--primary) 10%, transparent); border-color: var(--primary); color: var(--primary); }
.pp-open .pp-svg { width: 16px; height: 16px; }

/* Pager */
.pp-pager { display: flex; align-items: center; justify-content: center; gap: 6px; padding-top: 16px; margin-top: 4px; border-top: 1px solid var(--border); flex-wrap: wrap; }
.pp-pager--top { padding-top: 0; margin-top: 12px; border-top: none; padding-bottom: 4px; }
.pp-pager__btn { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--border); background: var(--surface); color: var(--text-muted); cursor: pointer; transition: background .15s, color .15s, border-color .15s; }
.pp-pager__btn:hover:not(:disabled) { background: var(--surface-3); color: var(--text); border-color: var(--border-strong); }
.pp-pager__btn:disabled { opacity: .4; cursor: default; }
.pp-pager__btn .pp-svg { width: 16px; height: 16px; }
.pp-pager__num { min-width: 34px; height: 34px; padding: 0 8px; border-radius: 9px; border: 1px solid transparent; background: transparent; color: var(--text-muted); font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s, color .15s, border-color .15s; }
.pp-pager__num:hover:not(:disabled):not(.pp-pager__num--active) { background: var(--surface-3); color: var(--text); }
.pp-pager__num--active { background: var(--primary); color: #fff; }
.pp-pager__num--gap { cursor: default; color: var(--text-subtle); }

.pp-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px 16px; color: var(--text-subtle); margin-top: 14px; }
.pp-empty .pp-svg { width: 30px; height: 30px; }
.pp-svg { display: block; }

/* Narrow: stack Open under content */
@container (max-width: 460px) {
  .pp-task { flex-wrap: wrap; }
  .pp-open { justify-content: center; width: 100%; max-width: 100%; margin-left: 0; }
}
</style>
