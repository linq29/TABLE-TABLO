const timetableData = {
  defaultSelectedTimetableIds: ["IH"],
  weekdays: [
    { id: "mon", label: "月" },
    { id: "tue", label: "火" },
    { id: "wed", label: "水" },
    { id: "thu", label: "木" },
    { id: "fri", label: "金" }
  ],
  periods: [
    { id: 1, label: "1限", start: "09:30", end: "11:00" },
    { id: 2, label: "2限", start: "11:10", end: "12:40" },
    { id: 3, label: "3限", start: "12:50", end: "14:20" },
    { id: 4, label: "4限", start: "14:30", end: "16:00" },
    { id: 5, label: "5限", start: "16:10", end: "17:40" },
    { id: 6, label: "6限", start: "17:50", end: "19:20" }
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

function createLesson(entry) {
  const lesson = document.createElement("div");
  const subject = document.createElement("div");
  const detail = document.createElement("div");

  lesson.className = "lesson";
  subject.className = "subject";
  subject.textContent = entry.courseId;
  detail.className = "detail";
  detail.textContent = entry.room;
  lesson.append(subject, detail);

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

function findStartingEntry(timetable, weekdayId, periodId) {
  return timetable.entries.find((entry) => entry.weekday === weekdayId && entry.period === periodId);
}

function renderTimetable(timetableId) {
  const timetable = timetableData.timetables.find((item) => item.id === timetableId) || timetableData.timetables[0];
  const coveredCells = new Set();

  renderHead();
  body.replaceChildren();
  renderMeta(timetable);

  timetableData.periods.forEach((period) => {
    const row = document.createElement("tr");
    row.append(createPeriodCell(period));

    timetableData.weekdays.forEach((weekday) => {
      const key = `${weekday.id}:${period.id}`;
      if (coveredCells.has(key)) {
        return;
      }

      const td = document.createElement("td");
      const entry = findStartingEntry(timetable, weekday.id, period.id);
      if (entry) {
        td.rowSpan = entry.span;
        td.append(createLesson(entry));

        for (let offset = 1; offset < entry.span; offset += 1) {
          coveredCells.add(`${weekday.id}:${period.id + offset}`);
        }
      }

      row.append(td);
    });

    body.append(row);
  });
}

function renderMeta(timetable) {
  sheetMeta.textContent = `Solo Mode / 担任：${timetable.teacher}`;
}

function renderOptions() {
  const defaultId = timetableData.defaultSelectedTimetableIds[0] || timetableData.timetables[0].id;

  options.replaceChildren();
  timetableData.timetables.forEach((timetable) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const text = document.createElement("span");

    label.className = `timetable-option timetable-option-${timetable.id.toLowerCase()}`;
    input.type = "radio";
    input.name = "timetable-view";
    input.value = timetable.id;
    input.checked = timetable.id === defaultId;
    text.textContent = timetable.label;

    label.append(input, text);
    options.append(label);
  });
}

function bindOptions() {
  options.addEventListener("change", (event) => {
    if (!event.target.matches('input[name="timetable-view"]')) {
      return;
    }

    renderTimetable(event.target.value);
  });
}

renderOptions();
bindOptions();
renderTimetable(document.querySelector('input[name="timetable-view"]:checked').value);
