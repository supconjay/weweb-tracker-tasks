export default {
  editor: { label: { en: "Task Cards" } },
  triggerEvents: [
    { name: "openTask", label: { en: "On task open click" }, event: { id: "", index: 0, task: {} } },
    { name: "addItem", label: { en: "On add item click" }, event: {} },
    { name: "photoClick", label: { en: "On photo click" }, event: { group: "before", index: 0, url: "", type: "", filename: "", isImage: true, photo: {}, photos: [], taskId: "", task: {} } },
    { name: "pageChange", label: { en: "On page change" }, event: { page: 1 } },
    { name: "completeToggle", label: { en: "On complete toggled" }, event: { id: "", index: 0, previous: false, value: true, task: {} } },
    { name: "descriptionChange", label: { en: "On description edited" }, event: { id: "", index: 0, previous: "", value: "", task: {} } },
    { name: "costChange", label: { en: "On labor/material edited" }, event: { id: "", index: 0, kind: "labor", field: "Labor Cost", previous: 0, value: 0, task: {} } },
    { name: "addPhotos", label: { en: "On add photos click" }, event: { group: "before", id: "", index: 0, photos: [], task: {} } },
  ],
  properties: {
    title: { label: { en: "Header title" }, type: "Text", defaultValue: "Tasks", bindable: true },
    intro: { label: { en: "Intro text (optional)" }, type: "Text", defaultValue: "", bindable: true },

    // ---- Data ----
    tasks: {
      label: { en: "Tasks (list)" }, type: "Array", bindable: true,
      // Accepts a plain array OR a full WeWeb collection { data: [...] }.
      defaultValue: [
        {
          id: "reccBvPBECBTuphvN",
          "Task Number": 1,
          "Name (from Category)": ["Cabinets"],
          "Tech Description": "0401 - Remove peeling thermofoil (if applicable). Prep, prime & paint cabinets (inside/outside) using primer and paint products formulated for cabinet application (>36”)\n\nInstall cabinet overlay at (3) damaged locations",
          location_name: "Kitchen",
          Complete: false,
          "Labor Cost": 400,
          "Material Cost": 275,
          completion_date: "",
          "Before Photos": [
            { url: "https://picsum.photos/id/26/400/300", thumbnails: { small: { url: "https://picsum.photos/id/26/120/120" } } },
            { url: "https://picsum.photos/id/48/400/300", thumbnails: { small: { url: "https://picsum.photos/id/48/120/120" } } },
          ],
          "Completion Photos": [],
        },
        {
          id: "reclsupAMmSbIbH4l",
          "Task Number": 2,
          "Name (from Category)": ["Cabinets"],
          "Tech Description": "1104 - [Pull] Install/Replace missing/damaged cabinet pull",
          location_name: "Kitchen",
          Complete: true,
          "Labor Cost": 42,
          "Material Cost": 126,
          completion_date: "2026-07-18",
          "Before Photos": [
            { url: "https://picsum.photos/id/60/400/300", thumbnails: { small: { url: "https://picsum.photos/id/60/120/120" } } },
          ],
          "Completion Photos": [
            { url: "https://picsum.photos/id/119/400/300", thumbnails: { small: { url: "https://picsum.photos/id/119/120/120" } } },
            { url: "https://picsum.photos/id/133/400/300", thumbnails: { small: { url: "https://picsum.photos/id/133/120/120" } } },
          ],
        },
        {
          id: "recX3",
          "Task Number": 3,
          "Name (from Category)": ["Cabinets"],
          "Tech Description": "Replace aged cabinet hinges using satin nickel finish.",
          location_name: "Kitchen",
          Complete: false,
          "Labor Cost": 90,
          "Material Cost": 60,
          completion_date: "",
          "Before Photos": [],
          "Completion Photos": [],
        },
      ],
    },

    // ---- Field mapping ----
    idField: { label: { en: "Field: id" }, type: "Text", defaultValue: "id", bindable: true, section: "settings" },
    taskNumberField: { label: { en: "Field: task number" }, type: "Text", defaultValue: "Task Number", bindable: true, section: "settings" },
    categoryField: { label: { en: "Field: category" }, type: "Text", defaultValue: "Name (from Category)", bindable: true, section: "settings" },
    descriptionField: { label: { en: "Field: description" }, type: "Text", defaultValue: "Tech Description", bindable: true, section: "settings" },
    locationField: { label: { en: "Field: location" }, type: "Text", defaultValue: "location_name", bindable: true, section: "settings" },
    completeField: { label: { en: "Field: complete (boolean)" }, type: "Text", defaultValue: "Complete", bindable: true, section: "settings" },
    completionDateField: { label: { en: "Field: completion date" }, type: "Text", defaultValue: "completion_date", bindable: true, section: "settings" },
    laborField: { label: { en: "Field: labor cost" }, type: "Text", defaultValue: "Labor Cost", bindable: true, section: "settings" },
    materialField: { label: { en: "Field: material cost" }, type: "Text", defaultValue: "Material Cost", bindable: true, section: "settings" },
    beforePhotosField: { label: { en: "Field: before photos" }, type: "Text", defaultValue: "Before Photos", bindable: true, section: "settings" },
    afterPhotosField: { label: { en: "Field: completion photos" }, type: "Text", defaultValue: "Completion Photos", bindable: true, section: "settings" },

    // ---- Header / labels ----
    showHeader: { label: { en: "Show header" }, type: "OnOff", defaultValue: true, bindable: true },
    showCount: { label: { en: "Show task count" }, type: "OnOff", defaultValue: true, bindable: true },
    showAddItem: { label: { en: "Show 'Add Item' button" }, type: "OnOff", defaultValue: false, bindable: true },
    addItemLabel: { label: { en: "Add Item label" }, type: "Text", defaultValue: "Add Item", bindable: true },
    taskPrefix: { label: { en: "Task label prefix" }, type: "Text", defaultValue: "Task", bindable: true },
    showOpen: { label: { en: "Show 'Open' button" }, type: "OnOff", defaultValue: true, bindable: true },
    openLabel: { label: { en: "Open label" }, type: "Text", defaultValue: "Open", bindable: true },

    // ---- Inline editing (all edits are emit-only; persist via workflows) ----
    editable: { label: { en: "Inline editing (desc / photos / complete)" }, type: "OnOff", defaultValue: true, bindable: true },
    editCosts: { label: { en: "Allow editing labor / material" }, type: "OnOff", defaultValue: true, bindable: true },
    showCompleteHint: { label: { en: "Show mark-complete reminder" }, type: "OnOff", defaultValue: true, bindable: true },
    completeHintText: { label: { en: "Reminder text" }, type: "Text", defaultValue: "When finished, tap the clock icon to mark this task complete.", bindable: true },
    addPhotosLabel: { label: { en: "Add-photos tooltip" }, type: "Text", defaultValue: "Add photos", bindable: true },

    // ---- Financials ----
    showFinancials: { label: { en: "Show labor / material" }, type: "OnOff", defaultValue: true, bindable: true },
    laborLabel: { label: { en: "Labor label" }, type: "Text", defaultValue: "Labor", bindable: true },
    materialLabel: { label: { en: "Material label" }, type: "Text", defaultValue: "Material", bindable: true },
    currencyPrefix: { label: { en: "Currency prefix" }, type: "Text", defaultValue: "$", bindable: true },

    // ---- Completion ----
    completedPrefix: { label: { en: "Completed badge prefix" }, type: "Text", defaultValue: "Completed", bindable: true },

    // ---- Photos ----
    showPhotos: { label: { en: "Show photo thumbnails" }, type: "OnOff", defaultValue: true, bindable: true },
    beforeLabel: { label: { en: "Before photos label" }, type: "Text", defaultValue: "Before", bindable: true },
    afterLabel: { label: { en: "Completion photos label" }, type: "Text", defaultValue: "Completion", bindable: true },
    photoMax: { label: { en: "Max thumbnails per group" }, type: "Number", options: { min: 1, max: 20, step: 1 }, defaultValue: 4, bindable: true },
    photosEmptyText: { label: { en: "No-photos text" }, type: "Text", defaultValue: "No photos", bindable: true },
    thumbnailSize: {
      label: { en: "Thumbnail size (Airtable)" }, type: "TextSelect",
      options: { options: [
        { value: "small", label: { en: "Small" } },
        { value: "large", label: { en: "Large" } },
        { value: "full", label: { en: "Full" } },
      ] }, defaultValue: "small", bindable: true,
    },

    // ---- Pagination ----
    paginate: { label: { en: "Paginate (built-in)" }, type: "OnOff", defaultValue: true, bindable: true },
    pageSize: { label: { en: "Tasks per page" }, type: "Number", options: { min: 1, max: 100, step: 1 }, defaultValue: 10, bindable: true },
    pagerTop: { label: { en: "Show top pager" }, type: "OnOff", defaultValue: true, bindable: true },
    pagerBottom: { label: { en: "Show bottom pager" }, type: "OnOff", defaultValue: true, bindable: true },

    // ---- Empty ----
    emptyListText: { label: { en: "Empty list text" }, type: "Text", defaultValue: "No tasks to display", bindable: true },

    // ---- Theme (standard across pp- components) ----
    primaryColor: { label: { en: "Primary color" }, type: "Color", defaultValue: "#10b981", bindable: true },
    accentColor: { label: { en: "Accent color" }, type: "Color", defaultValue: "#6366f1", bindable: true },
    darkMode: {
      label: { en: "Theme mode" }, type: "TextSelect",
      options: { options: [
        { value: "auto", label: { en: "Auto (system)" } },
        { value: "light", label: { en: "Light" } },
        { value: "dark", label: { en: "Dark" } },
      ] }, defaultValue: "auto", bindable: true,
    },
    radius: { label: { en: "Corner radius (px)" }, type: "Number", options: { min: 0, max: 32, step: 1 }, defaultValue: 16, bindable: true },
  },
};
