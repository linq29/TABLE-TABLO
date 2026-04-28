const fallbackTimetableData = {
  weekdays: [
    { id: "mon", label: "月" },
    { id: "tue", label: "火" },
    { id: "wed", label: "水" },
    { id: "thu", label: "木" },
    { id: "fri", label: "金" },
    { id: "sat", label: "土" }
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
      entries: [
        { weekday: "mon", period: 3, span: 2, courseId: "NT29", room: "246" },
        { weekday: "mon", period: 5, span: 1, courseId: "IO26", room: "246" },
        { weekday: "tue", period: 3, span: 1, courseId: "IP3S", room: "298" },
        { weekday: "tue", period: 4, span: 2, courseId: "IH29", room: "296/OL" },
        { weekday: "wed", period: 4, span: 1, courseId: "SK29", room: "OL" },
        { weekday: "wed", period: 5, span: 1, courseId: "FX29", room: "OL" },
        { weekday: "thu", period: 1, span: 2, courseId: "IH29", room: "285" },
        { weekday: "fri", period: 1, span: 2, courseId: "ST29", room: "121" },
        { weekday: "fri", period: 4, span: 2, courseId: "JV29", room: "332" }
      ]
    }
  ]
};

const head = document.querySelector("#timetable-head");
const body = document.querySelector("#timetable-body");
const timetableToggle = document.querySelector("#timetable-toggle");
let timetableData = fallbackTimetableData;

function createLesson(entry) {
  const lesson = document.createElement("div");
  lesson.className = "lesson";

  const subject = document.createElement("div");
  subject.className = "subject";
  subject.textContent = entry.courseId;

  const detail = document.createElement("div");
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

function renderTimetable(timetableId) {
  const selected = timetableData.timetables.find((item) => item.id === timetableId) || timetableData.timetables[0];
  const entries = new Map(selected.entries.map((entry) => [`${entry.weekday}:${entry.period}`, entry]));
  const covered = new Set();

  renderHead();
  body.replaceChildren();

  timetableData.periods.forEach((period) => {
    const row = document.createElement("tr");
    const periodCell = document.createElement("th");
    const periodLabel = document.createElement("span");
    const periodTime = document.createElement("span");
    periodCell.scope = "row";
    periodLabel.className = "period";
    periodLabel.textContent = period.label;
    periodTime.className = "time";
    periodTime.append(period.start, document.createElement("br"), period.end);
    periodCell.append(periodLabel, periodTime);
    row.append(periodCell);

    timetableData.weekdays.forEach((weekday) => {
      const cellKey = `${weekday.id}:${period.id}`;
      if (covered.has(cellKey)) {
        return;
      }

      const td = document.createElement("td");
      const entry = entries.get(cellKey);
      if (entry) {
        td.rowSpan = entry.span;
        td.append(createLesson(entry));

        for (let offset = 1; offset < entry.span; offset += 1) {
          covered.add(`${weekday.id}:${period.id + offset}`);
        }
      }

      row.append(td);
    });

    body.append(row);
  });
}

timetableToggle.addEventListener("change", (event) => {
  renderTimetable(event.target.checked ? "PI" : "IH");
});

fetch("data/timetables.json")
  .then((response) => response.ok ? response.json() : fallbackTimetableData)
  .then((data) => {
    timetableData = {
      ...data,
      timetables: data.timetables.filter((item) => item.id === "IH" || item.id === "PI")
    };
    renderTimetable(timetableToggle.checked ? "PI" : "IH");
  })
  .catch(() => {
    renderTimetable("IH");
  });
