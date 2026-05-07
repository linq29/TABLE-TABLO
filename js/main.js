const timetableData = {
  schemaVersion: 1,
  academicYear: 2026,
  constraints: {
    coursePeriodSpan: {
      min: 1,
      max: 2
    },
    maxSelectedTimetables: 3
  },
  defaultSelectedTimetableIds: ["IH"],
  weekdays: [
    { id: "mon", label: "月" },
    { id: "tue", label: "火" },
    { id: "wed", label: "水" },
    { id: "thu", label: "木" },
    { id: "fri", label: "金" }
  ],
  periods: [
    { id: 1, label: "1限", start: "09:30", end: "11:00", durationMinutes: 90 },
    { id: 2, label: "2限", start: "11:10", end: "12:40", durationMinutes: 90 },
    { id: 3, label: "3限", start: "12:50", end: "14:20", durationMinutes: 90 },
    { id: 4, label: "4限", start: "14:30", end: "16:00", durationMinutes: 90 },
    { id: 5, label: "5限", start: "16:10", end: "17:40", durationMinutes: 90 },
    { id: 6, label: "6限", start: "17:50", end: "19:20", durationMinutes: 90 }
  ],
  timetables: [
    {
      id: "IH",
      label: "IH",
      teacher: "タカヒロ",
      entries: [
        { weekday: "mon", period: 3, span: 2, courseId: "NT32", room: "246" },
        { weekday: "mon", period: 5, span: 1, courseId: "IO32", room: "246" },
        { weekday: "tue", period: 3, span: 1, courseId: "CS3F", room: "OL" },
        { weekday: "tue", period: 4, span: 2, courseId: "IH31", room: "OL" },
        { weekday: "wed", period: 3, span: 1, courseId: "BT31", room: "OL" },
        { weekday: "wed", period: 4, span: 1, courseId: "SK32", room: "OL" },
        { weekday: "wed", period: 5, span: 1, courseId: "FX31", room: "OL" },
        { weekday: "thu", period: 1, span: 2, courseId: "IH31", room: "285" },
        { weekday: "fri", period: 1, span: 2, courseId: "ST31", room: "121" },
        { weekday: "fri", period: 4, span: 2, courseId: "JV31", room: "332" }
      ]
    },
    {
      id: "PI",
      label: "PI",
      teacher: "タカヒロ",
      entries: [
        { weekday: "mon", period: 3, span: 2, courseId: "NT29", room: "246" },
        { weekday: "mon", period: 5, span: 1, courseId: "IO26", room: "246" },
        { weekday: "tue", period: 3, span: 1, courseId: "IP3S", room: "298" },
        { weekday: "tue", period: 4, span: 2, courseId: "IH29", room: "296" },
        { weekday: "wed", period: 4, span: 1, courseId: "SK29", room: "OL" },
        { weekday: "wed", period: 5, span: 1, courseId: "FX29", room: "OL" },
        { weekday: "thu", period: 1, span: 2, courseId: "IH29", room: "285" },
        { weekday: "fri", period: 1, span: 2, courseId: "ST29", room: "121" },
        { weekday: "fri", period: 4, span: 2, courseId: "JV29", room: "332" }
      ]
    },
    {
      id: "PW",
      label: "PW",
      teacher: "ショウコ",
      entries: [
        { weekday: "mon", period: 4, span: 1, courseId: "FX29", room: "296" },
        { weekday: "mon", period: 5, span: 1, courseId: "EW29", room: "296" },
        { weekday: "mon", period: 6, span: 1, courseId: "MD29", room: "296" },
        { weekday: "tue", period: 3, span: 1, courseId: "IP3S", room: "298" },
        { weekday: "tue", period: 4, span: 2, courseId: "IW29", room: "296" },
        { weekday: "wed", period: 4, span: 2, courseId: "PH29", room: "334" },
        { weekday: "thu", period: 1, span: 2, courseId: "IW29", room: "285" },
        { weekday: "thu", period: 4, span: 2, courseId: "FD29", room: "334" },
        { weekday: "fri", period: 1, span: 2, courseId: "WB29", room: "OL" }
      ]
    }
  ]
};

const head = document.querySelector("#timetable-head");
const body = document.querySelector("#timetable-body");
const options = document.querySelector("#timetable-options");
const sheetMeta = document.querySelector("#sheet-meta");
const currentMode = document.querySelector(".current-mode");
const mode = document.body.dataset.mode === "solo" ? "solo" : "crew";
const modeConfig = {
  solo: {
    inputType: "radio",
    label: "Solo Mode"
  },
  crew: {
    inputType: "checkbox",
    label: "Crew Mode"
  }
};

function getMaxSelectedTimetables() {
  return timetableData?.constraints?.maxSelectedTimetables || timetableData?.timetables?.length || 1;
}

function getSelectedTimetableIds() {
  return [...options.querySelectorAll('input[name="timetable-view"]:checked')].map((input) => input.value);
}

function getSelectedTimetables() {
  const selectedIds = getSelectedTimetableIds();
  return timetableData.timetables.filter((timetable) => selectedIds.includes(timetable.id));
}

function createPeriodCell(period) {
  const periodCell = document.createElement("th");
  const periodLabel = document.createElement("span");
  const periodTime = document.createElement("span");

  periodCell.scope = "row";
  periodLabel.className = "period";
  periodLabel.textContent = period.label;
  periodTime.className = "time";
  periodTime.append(period.start, document.createElement("br"), period.end);
  periodCell.append(periodLabel, periodTime);

  return periodCell;
}

function createLesson(entry, timetable = null) {
  const lesson = document.createElement("div");
  const subject = document.createElement(mode === "crew" ? "span" : "div");
  const detail = document.createElement("div");

  lesson.className = timetable ? `lesson lesson-${timetable.id.toLowerCase()}` : "lesson";

  subject.className = "subject";
  subject.textContent = entry.courseId;

  detail.className = "detail";
  detail.textContent = entry.room;

  if (mode === "crew") {
    const meta = document.createElement("div");
    meta.className = "lesson-meta";
    meta.append(subject);
    lesson.append(meta, detail);
  } else {
    lesson.append(subject, detail);
  }

  return lesson;
}

function renderHead() {
  head.replaceChildren();

  const periodHead = document.createElement("th");
  periodHead.scope = "col";
  periodHead.className = "period-col";
  head.append(periodHead);

  timetableData.weekdays.forEach((weekday) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = weekday.label;
    head.append(th);
  });
}

function findEntriesForCell(timetable, weekdayId, periodId) {
  return timetable.entries.filter((entry) => {
    const entryEnd = entry.period + entry.span;
    return entry.weekday === weekdayId && periodId >= entry.period && periodId < entryEnd;
  });
}

function findStartingEntry(timetable, weekdayId, periodId) {
  return timetable.entries.find((entry) => entry.weekday === weekdayId && entry.period === periodId);
}

function renderSoloTimetable(selectedTimetable) {
  const coveredCells = new Set();

  renderHead();
  body.replaceChildren();
  renderMeta([selectedTimetable]);

  timetableData.periods.forEach((period) => {
    const row = document.createElement("tr");
    row.append(createPeriodCell(period));

    timetableData.weekdays.forEach((weekday) => {
      const key = `${weekday.id}:${period.id}`;
      if (coveredCells.has(key)) {
        return;
      }

      const td = document.createElement("td");
      const entry = findStartingEntry(selectedTimetable, weekday.id, period.id);
      if (entry) {
        td.rowSpan = entry.span;
        td.append(createLesson(entry));

        for (let offset = 1; offset < entry.span; offset += 1) {
          coveredCells.add(`${weekday.id}:${period.id + offset}`);
        }
      } else {
        td.classList.add("is-free");
      }

      row.append(td);
    });

    body.append(row);
  });
}

function renderCrewTimetable(selectedTimetables) {
  renderHead();
  body.replaceChildren();
  renderMeta(selectedTimetables);

  timetableData.periods.forEach((period) => {
    const row = document.createElement("tr");
    row.append(createPeriodCell(period));

    timetableData.weekdays.forEach((weekday) => {
      const td = document.createElement("td");
      const lessons = document.createElement("div");

      lessons.className = "lesson-stack";
      selectedTimetables.forEach((timetable) => {
        findEntriesForCell(timetable, weekday.id, period.id).forEach((entry) => {
          lessons.append(createLesson(entry, timetable));
        });
      });

      if (!lessons.children.length) {
        td.classList.add("is-free");
      }

      td.append(lessons);
      row.append(td);
    });

    body.append(row);
  });
}

function renderTimetable() {
  const selectedTimetables = getSelectedTimetables();
  const fallbackTimetable = timetableData.timetables[0];

  if (mode === "solo") {
    renderSoloTimetable(selectedTimetables[0] || fallbackTimetable);
    return;
  }

  renderCrewTimetable(selectedTimetables);
}

function renderMeta(selectedTimetables) {
  const teachers = [...new Set(selectedTimetables.map((timetable) => timetable.teacher).filter(Boolean))];
  currentMode.textContent = modeConfig[mode].label;
  sheetMeta.textContent = `担任：${teachers.join("・")}`;
}

function renderOptions() {
  const defaultIds = timetableData.defaultSelectedTimetableIds || [timetableData.timetables[0]?.id];
  const modeDefaultIds = mode === "solo"
    ? [defaultIds[0]]
    : timetableData.timetables.slice(0, getMaxSelectedTimetables()).map((timetable) => timetable.id);
  const defaultSelectedIds = new Set(modeDefaultIds);

  options.replaceChildren();
  timetableData.timetables.forEach((timetable) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const text = document.createElement("span");

    label.className = `timetable-option timetable-option-${timetable.id.toLowerCase()}`;
    input.type = modeConfig[mode].inputType;
    input.name = "timetable-view";
    input.value = timetable.id;
    input.checked = defaultSelectedIds.has(timetable.id);
    text.textContent = timetable.label;

    label.append(input, text);
    options.append(label);
  });
}

function enforceSelectionLimit(changedInput) {
  if (mode === "solo") {
    return;
  }

  const selectedInputs = [...options.querySelectorAll('input[name="timetable-view"]:checked')];
  const maxSelected = getMaxSelectedTimetables();

  if (selectedInputs.length > maxSelected) {
    changedInput.checked = false;
  }

  if (!getSelectedTimetableIds().length) {
    changedInput.checked = true;
  }
}

function bindOptions() {
  options.addEventListener("change", (event) => {
    if (!event.target.matches('input[name="timetable-view"]')) {
      return;
    }

    enforceSelectionLimit(event.target);
    renderTimetable();
  });
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => copyTextWithTextarea(text));
  }

  return copyTextWithTextarea(text);
}

function copyTextWithTextarea(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();

  return Promise.resolve();
}

function showCopyFeedback(target) {
  const noteItem = target.closest(".notes li");
  const button = target.matches(".note-copy-button")
    ? target
    : noteItem?.querySelector(target.matches(".note-id-value") ? ".note-id-copy" : ".note-pw-copy");

  if (!button) {
    return;
  }

  button.textContent = "COPIED";
  window.setTimeout(() => {
    button.textContent = "COPY";
  }, 1200);
}

function handleNoteCopy(target) {
  const copyTarget = target.closest("[data-copy-value]");

  if (!copyTarget) {
    return;
  }

  copyText(copyTarget.dataset.copyValue).then(() => {
    showCopyFeedback(copyTarget);
  });
}

function bindNotesCopy() {
  const notes = document.querySelector(".notes");

  if (!notes) {
    return;
  }

  notes.addEventListener("click", (event) => {
    handleNoteCopy(event.target);
  });

  notes.addEventListener("keydown", (event) => {
    if (!event.target.matches(".note-copy-value") || !["Enter", " "].includes(event.key)) {
      return;
    }

    event.preventDefault();
    handleNoteCopy(event.target);
  });
}

renderOptions();
bindOptions();
bindNotesCopy();
renderTimetable();
