import { useEffect, useRef, useState } from "react";

const assets = `${import.meta.env.BASE_URL}assets`;

type Rule = {
  id: number;
  status: string;
  standard: string;
  segment: string;
  markup: string;
  kc: string;
  activation: string;
  created: string;
  beautifulPrice: boolean;
  attributes: string[];
  categoryLevels: number[];
  categorySelections: Record<number, string[]>;
  uploadedFile: string;
};

type DropdownProps = {
  label: string;
  options: string[];
  value: string;
  onChange?: (value: string) => void;
  interactive?: boolean;
};

function Dropdown({ label, options, value, onChange, interactive = true }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [interactive]);

  return (
    <div className="relative" ref={root}>
      <button
        className={`filter-chip ${interactive ? "" : "is-static"}`}
        type="button"
        aria-label={label}
        aria-expanded={interactive ? open : undefined}
        onClick={interactive ? () => setOpen((current) => !current) : undefined}
      >
        <span>{value}</span>
        <img
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          src={`${assets}/fd2eb.svg`}
          alt=""
        />
      </button>
      {interactive && open && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={option === value ? "is-selected" : ""}
              onClick={() => {
                onChange?.(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuRow({
  children,
  depth = 0,
  selected = false,
  icon,
  expanded,
  onClick,
}: {
  children: React.ReactNode;
  depth?: number;
  selected?: boolean;
  icon?: string;
  expanded?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`menu-row ${selected ? "is-selected" : ""}`}
      style={{ paddingLeft: 16 + depth * 16 }}
      onClick={onClick}
    >
      {icon && <img src={`${assets}/${icon}`} alt="" />}
      <span>{children}</span>
      {expanded !== undefined && (
        <img
          className={`chevron ${expanded ? "" : "rotate-180"}`}
          src={`${assets}/a049a.svg`}
          alt=""
        />
      )}
    </button>
  );
}

function Sidebar({
  collapsed,
  compact,
  mobileOpen,
  onCollapse,
  onClose,
}: {
  collapsed: boolean;
  compact?: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onClose: () => void;
}) {
  const [fastOpen, setFastOpen] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(true);
  const [marketOpen, setMarketOpen] = useState(true);

  return (
    <>
      {mobileOpen && (
        <button className="mobile-backdrop" aria-label="Закрыть меню" onClick={onClose} />
      )}
      <aside
        className={`sidebar ${collapsed ? "is-collapsed" : ""} ${compact ? "is-form-compact" : ""} ${mobileOpen ? "is-mobile-open" : ""}`}
      >
        <div className="sidebar-header">
          <img src={`${assets}/44ad0.svg`} alt="Pricing Engine" />
          <span>Pricing Engine</span>
          <button
            className="mobile-close"
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Основная навигация">
          {compact ? (
            <>
              <MenuRow icon="34cb2.svg">Скидки по подписке</MenuRow>
              <MenuRow icon="9189d.svg" selected>
                Быстро
              </MenuRow>
              <MenuRow icon="2a3f2.svg">Микромаркет</MenuRow>
            </>
          ) : (
            <>
              <MenuRow icon="58f08.svg">Скидки по подписке</MenuRow>
              <MenuRow
                icon="b5180.svg"
                expanded={fastOpen}
                onClick={() => setFastOpen((value) => !value)}
              >
                Быстро
              </MenuRow>
              {fastOpen && (
                <>
                  <MenuRow depth={1}>Проверка цен</MenuRow>
                  <MenuRow depth={1} expanded={false}>
                    Защита цен
                  </MenuRow>
                  <MenuRow
                    depth={1}
                    expanded={rulesOpen}
                    onClick={() => setRulesOpen((value) => !value)}
                  >
                    Правила
                  </MenuRow>
                  {rulesOpen && (
                    <>
                      <MenuRow depth={2}>По маржинальности</MenuRow>
                      <MenuRow depth={2} selected>
                        По сегментам
                      </MenuRow>
                    </>
                  )}
                  <MenuRow depth={1}>Объединение ЦФЗ</MenuRow>
                  <MenuRow depth={1}>Установка цен</MenuRow>
                </>
              )}
              <MenuRow
                icon="ee966.svg"
                expanded={marketOpen}
                onClick={() => setMarketOpen((value) => !value)}
              >
                Микромаркет
              </MenuRow>
              {marketOpen && (
                <>
                  <MenuRow depth={1}>Проверка цен</MenuRow>
                  <MenuRow depth={1} expanded={false}>
                    Защита цен
                  </MenuRow>
                  <MenuRow depth={1} expanded={false}>
                    Правила
                  </MenuRow>
                  <MenuRow depth={1}>Объединение ЦФЗ</MenuRow>
                  <MenuRow depth={1}>Установка цен</MenuRow>
                </>
              )}
            </>
          )}
        </nav>

        <div className="sidebar-help">
          <MenuRow icon="28d91.svg">Инструкция</MenuRow>
        </div>
        <div className="sidebar-footer">
          {!compact && (
            <button type="button" className="profile-button">
              Ермолаев Константин
            </button>
          )}
          <button
            className="collapse-button"
            type="button"
            onClick={onCollapse}
            aria-label="Свернуть меню"
          >
            <img src={`${assets}/${compact ? "98429.svg" : "48143.svg"}`} alt="" />
            <span className="tooltip">{compact ? "Развернуть меню" : "Свернуть меню"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

type RuleFormValues = {
  standard: string;
  segment: string;
  markup: string;
  activation: string;
  status: "Активное" | "Планируемое";
  beautifulPrice: boolean;
  attributes: string[];
  categoryLevels: number[];
  categorySelections: Record<number, string[]>;
  uploadedFile: string;
};

const priceGroupOptions = [
  "АЛМ стандарт",
  "АНП стандарт",
  "МСК стандарт",
  "СПБ стандарт",
  "КЗН стандарт",
  "МСК тест +8%",
  "МСК тест +5%",
  "СПБ тест +2,5%",
  "КЗН +8%",
  "КЗН +2%",
  "КЗН +4%",
  "КЗН +6%",
];

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const categoryOptionsByLevel: Record<number, string[]> = {
  1: ["Продукты питания", "Непродовольственные товары", "Готовая еда", "Товары для дома"],
  2: ["Овощи и фрукты", "Молочные продукты", "Мясо и рыба", "Бакалея", "Напитки"],
  3: ["Свежие овощи", "Свежие фрукты", "Сыры", "Йогурты", "Полуфабрикаты"],
  4: ["Томаты", "Огурцы", "Яблоки", "Цитрусовые", "Мягкие сыры", "Твёрдые сыры"],
};

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateValue(value: string) {
  const [year, month, day] = value.split("-");
  return value ? `${day}.${month}.${year}` : "";
}

function ReadOnlyRuleContent({
  standard,
  segment,
  markup,
  activation,
  beautifulPrice,
  attributes,
  categoryLevels,
  categorySelections,
  uploadedFile,
  createdAt,
  editedAt,
}: {
  standard: string;
  segment: string;
  markup: string;
  activation: string;
  beautifulPrice: boolean;
  attributes: string[];
  categoryLevels: number[];
  categorySelections: Record<number, string[]>;
  uploadedFile: string;
  createdAt: string;
  editedAt: string;
}) {
  return (
    <div className="saved-rule-layout">
      <div className="saved-rule-cards">
        <section className="form-card readonly-card">
          <div className="form-card-heading">
            <h2>Правило на сегмент</h2>
            <p>На весь ассортимент сегмента (кроме исключений) применится надбавка</p>
          </div>
          <div className="readonly-grid">
            <div className="readonly-value">
              <span>Стандарт</span>
              <strong>{standard}</strong>
            </div>
            <div className="readonly-value">
              <span>Сегмент</span>
              <strong>{segment}</strong>
            </div>
            <div className="readonly-value">
              <span>Надбавка</span>
              <strong>{markup.replace(".", ",")} %</strong>
            </div>
            <div className="readonly-check-row">
              <span className={`readonly-check ${beautifulPrice ? "is-checked" : ""}`}>
                {beautifulPrice && <img src={`${assets}/aafaf.svg`} alt="" />}
              </span>
              <span>Применить «Красивую цену»</span>
            </div>
          </div>
          <div className="readonly-value">
            <span>Дата активации</span>
            <strong>
              {activation ? formatDateValue(activation) : formatDateValue(toDateValue(new Date()))}
            </strong>
          </div>
        </section>

        <section className="form-card readonly-card exceptions-card">
          <div className="form-card-heading">
            <h2>Исключения из сегмента</h2>
            <p>Для всех исключений цена будет равна стандартной</p>
          </div>
          <div className="readonly-section">
            <h3>Атрибуты</h3>
            <div className="readonly-attributes">
              {attributes.length > 0 ? (
                attributes.map((attribute) => (
                  <div className="readonly-check-row" key={attribute}>
                    <span className="readonly-check is-checked">
                      <img src={`${assets}/aafaf.svg`} alt="" />
                    </span>
                    <span>{attribute}</span>
                  </div>
                ))
              ) : (
                <span className="readonly-empty">Не выбраны</span>
              )}
            </div>
          </div>
          <div className="form-divider" />
          <div className="readonly-section">
            <h3>Категории</h3>
            {categoryLevels.length > 0 ? (
              categoryLevels.map((level) => (
                <div className="readonly-categories" key={level}>
                  <span>Категория {level}</span>
                  <div>
                    {(categorySelections[level] ?? []).map((category) => (
                      <span className="readonly-tag" key={category}>
                        {category}
                      </span>
                    ))}
                    {(categorySelections[level] ?? []).length === 0 && (
                      <span className="readonly-empty">Не выбраны</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <span className="readonly-empty">Не выбраны</span>
            )}
          </div>
          <div className="form-divider" />
          <div className="readonly-section">
            <h3>Товары</h3>
            {uploadedFile ? (
              <div className="products-added">
                <span>Добавлено: 25 000 GUID</span>
                <a
                  href={`${import.meta.env.BASE_URL}downloads/guid-exclusions.xlsx`}
                  download="guid-exclusions.xlsx"
                  aria-label="Скачать список GUID"
                >
                  <img src={`${assets}/e281e.svg`} alt="" />
                </a>
              </div>
            ) : (
              <span className="readonly-empty">Не добавлены</span>
            )}
          </div>
        </section>
      </div>

      <aside className="rule-history" aria-label="История правила">
        <div className="history-item">
          <span>Создано</span>
          <strong>{createdAt}</strong>
          <small>Иванов И.</small>
        </div>
        {editedAt && (
          <div className="history-item">
            <span>Отредактировано</span>
            <strong>{editedAt}</strong>
            <small>Иванов И.</small>
          </div>
        )}
      </aside>
    </div>
  );
}

function RuleForm({
  onBack,
  onSave,
  onUpdate,
  ruleNumber,
  initialRule,
}: {
  onBack: () => void;
  onSave: (values: RuleFormValues) => void;
  onUpdate: (ruleNumber: number, values: RuleFormValues) => void;
  ruleNumber: number;
  initialRule?: Rule;
}) {
  const [standard, setStandard] = useState(initialRule?.standard ?? "");
  const [segment, setSegment] = useState(initialRule?.segment ?? "");
  const [markup, setMarkup] = useState(
    initialRule ? initialRule.markup.replace(/%$/, "") : "",
  );
  const [activation, setActivation] = useState(initialRule?.activation ?? "");
  const [beautifulPrice, setBeautifulPrice] = useState(initialRule?.beautifulPrice ?? false);
  const [attributes, setAttributes] = useState<string[]>(initialRule?.attributes ?? []);
  const [categoryLevels, setCategoryLevels] = useState<number[]>(
    initialRule?.categoryLevels ?? [],
  );
  const [categorySelections, setCategorySelections] = useState<Record<number, string[]>>(
    initialRule?.categorySelections ?? {},
  );
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [openCategoryLevel, setOpenCategoryLevel] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState(initialRule?.uploadedFile ?? "");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<File | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [saved, setSaved] = useState(Boolean(initialRule));
  const [editing, setEditing] = useState(false);
  const [createdRuleNumber] = useState(initialRule?.id ?? ruleNumber);
  const [createdAt, setCreatedAt] = useState(initialRule?.created ?? "");
  const [editedAt, setEditedAt] = useState("");
  const today = useRef(startOfLocalDay(new Date())).current;
  const latestDate = useRef(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 365),
  ).current;
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const datePicker = useRef<HTMLDivElement>(null);
  const categoryMenu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closePopovers = (event: MouseEvent) => {
      if (!datePicker.current?.contains(event.target as Node)) setCalendarOpen(false);
      if (!categoryMenu.current?.contains(event.target as Node)) setCategoryMenuOpen(false);
      if (!(event.target as Element).closest(".category-multiselect")) setOpenCategoryLevel(null);
    };
    document.addEventListener("mousedown", closePopovers);
    return () => document.removeEventListener("mousedown", closePopovers);
  }, []);

  useEffect(() => {
    if (!uploadModalOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUploadModalOpen(false);
        setPendingUpload(null);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [uploadModalOpen]);

  const toggleAttribute = (attribute: string) => {
    setAttributes((current) =>
      current.includes(attribute)
        ? current.filter((item) => item !== attribute)
        : [...current, attribute],
    );
  };

  const toggleCategory = (level: number, category: string) => {
    setCategorySelections((current) => {
      const selected = current[level] ?? [];
      return {
        ...current,
        [level]: selected.includes(category)
          ? selected.filter((item) => item !== category)
          : [...selected, category],
      };
    });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const status = activation && activation > toDateValue(today) ? "Планируемое" : "Активное";
    const values: RuleFormValues = {
      standard,
      segment,
      markup,
      activation,
      status,
      beautifulPrice,
      attributes,
      categoryLevels,
      categorySelections,
      uploadedFile,
    };
    if (!saved) {
      onSave(values);
      setCreatedAt(new Intl.DateTimeFormat("ru-RU").format(new Date()));
      setSaved(true);
    } else {
      onUpdate(createdRuleNumber, values);
      setEditedAt(new Intl.DateTimeFormat("ru-RU").format(new Date()));
    }
    setCalendarOpen(false);
    setEditing(false);
  };

  const ruleStatus: "Активное" | "Планируемое" =
    activation && activation > toDateValue(today) ? "Планируемое" : "Активное";

  const firstDayOffset = (calendarMonth.getDay() + 6) % 7;
  const calendarStart = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1 - firstDayOffset,
  );
  const calendarDays = Array.from(
    { length: 42 },
    (_, index) =>
      new Date(
        calendarStart.getFullYear(),
        calendarStart.getMonth(),
        calendarStart.getDate() + index,
      ),
  );
  const previousMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
  const nextMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  const previousMonthLastDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 0);

  return (
    <main className="main-area form-page">
      <header className="page-header form-header">
        <button className="back-button" type="button" onClick={onBack} aria-label="Назад">
          <img src={`${assets}/01611.svg`} alt="" />
        </button>
        <div className="form-header-title">
          <h1>{saved ? `Правило ${createdRuleNumber}` : "Новое правило"}</h1>
          {saved && (
            <span
              className={`rule-status-badge is-${ruleStatus === "Активное" ? "active" : "planned"}`}
            >
              {ruleStatus}
            </span>
          )}
        </div>
        {saved && !editing ? (
          <div className="form-header-actions">
            <button className="finish-button" type="button">
              Завершить
            </button>
            <button className="primary-button" type="button" onClick={() => setEditing(true)}>
              <img src={`${assets}/88785.svg`} alt="" />
              Редактировать
            </button>
          </div>
        ) : (
          <button className="primary-button" type="submit" form="rule-form">
            Сохранить
          </button>
        )}
      </header>

      <div className="form-canvas">
        {saved && !editing ? (
          <ReadOnlyRuleContent
            standard={standard}
            segment={segment}
            markup={markup}
            activation={activation}
            beautifulPrice={beautifulPrice}
            attributes={attributes}
            categoryLevels={categoryLevels}
            categorySelections={categorySelections}
            uploadedFile={uploadedFile}
            createdAt={createdAt}
            editedAt={editedAt}
          />
        ) : (
          <form id="rule-form" className="rule-form" onSubmit={submit}>
            <section className="form-card">
              <div className="form-card-heading">
                <h2>Правило на сегмент</h2>
                <p>На весь ассортимент сегмента (кроме исключений) применится надбавка</p>
              </div>

              <div className="form-row">
                <label className="form-field">
                  <span>Стандарт</span>
                  <div className="select-wrap">
                    <select
                      required
                      disabled={saved}
                      value={standard}
                      onChange={(event) => setStandard(event.target.value)}
                    >
                      <option value="" disabled />
                      {priceGroupOptions.map((option) => (
                        <option key={option} value={option} disabled={option === segment}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <img src={`${assets}/fd2eb.svg`} alt="" />
                  </div>
                </label>

                <label className="form-field">
                  <span>Сегмент</span>
                  <div className="select-wrap">
                    <select
                      required
                      disabled={saved}
                      value={segment}
                      onChange={(event) => setSegment(event.target.value)}
                    >
                      <option value="" disabled />
                      {priceGroupOptions.map((option) => (
                        <option key={option} value={option} disabled={option === standard}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <img src={`${assets}/fd2eb.svg`} alt="" />
                  </div>
                </label>
              </div>

              <div className="form-row form-row-center">
                <label className="form-field">
                  <span>Надбавка</span>
                  <div className="numeric-wrap">
                    <input
                      required
                      min="0"
                      max="100"
                      step="0.1"
                      type="number"
                      value={markup}
                      onChange={(event) => setMarkup(event.target.value)}
                    />
                    <span>%</span>
                  </div>
                </label>

                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={beautifulPrice}
                    onChange={(event) => setBeautifulPrice(event.target.checked)}
                  />
                  <span>Применить «Красивую цену»</span>
                </label>
              </div>

              <div className="form-field date-field" ref={datePicker}>
                <span>Дата активации</span>
                <button
                  className={`date-wrap ${calendarOpen ? "is-open" : ""}`}
                  type="button"
                  disabled={saved && ruleStatus === "Активное"}
                  aria-haspopup="dialog"
                  aria-expanded={calendarOpen}
                  onClick={() => setCalendarOpen((current) => !current)}
                >
                  <img src={`${assets}/3b63e.svg`} alt="" />
                  <span className={activation ? "" : "date-placeholder"}>
                    {activation ? formatDateValue(activation) : "дд.мм.гггг"}
                  </span>
                </button>
                {calendarOpen && (
                  <div className="date-calendar" role="dialog" aria-label="Выбор даты активации">
                    <div className="calendar-header">
                      <button
                        type="button"
                        aria-label="Предыдущий месяц"
                        disabled={previousMonthLastDay < today}
                        onClick={() => setCalendarMonth(previousMonth)}
                      >
                        <img src={`${assets}/01611.svg`} alt="" />
                      </button>
                      <div>
                        <span>{monthNames[calendarMonth.getMonth()]}</span>
                        <span>{calendarMonth.getFullYear()}</span>
                      </div>
                      <button
                        type="button"
                        aria-label="Следующий месяц"
                        disabled={nextMonth > latestDate}
                        onClick={() => setCalendarMonth(nextMonth)}
                      >
                        <img src={`${assets}/98429.svg`} alt="" />
                      </button>
                    </div>
                    <div className="calendar-weekdays">
                      {weekDays.map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>
                    <div className="calendar-days">
                      {calendarDays.map((date) => {
                        const value = toDateValue(date);
                        const disabled = date < today || date > latestDate;
                        const anotherMonth = date.getMonth() !== calendarMonth.getMonth();
                        const selected = activation === value;
                        const isToday = toDateValue(today) === value;

                        return (
                          <button
                            type="button"
                            key={value}
                            disabled={disabled}
                            className={`${anotherMonth ? "is-another-month" : ""} ${selected ? "is-selected" : ""} ${isToday ? "is-today" : ""}`}
                            onClick={() => {
                              setActivation(value);
                              setCalendarOpen(false);
                            }}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <small>
                  Правило активируется в 00:00 (UTC +3) или сразу, если выбрана текущая дата
                </small>
              </div>
            </section>

            <section className="form-card exceptions-card">
              <div className="form-card-heading">
                <h2>Исключения из сегмента</h2>
                <p>Для всех исключений цена будет равна стандартной</p>
              </div>

              <div className="fieldset">
                <h3>Атрибуты</h3>
                <div className="attribute-list">
                  {["KVI", "CИ", "СТМ"].map((attribute) => (
                    <label className="check-field" key={attribute}>
                      <input
                        type="checkbox"
                        checked={attributes.includes(attribute)}
                        onChange={() => toggleAttribute(attribute)}
                      />
                      <span>{attribute}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-divider" />

              <div className="fieldset">
                <h3>Категории</h3>
                {categoryLevels.map((level) => (
                  <div className="category-level-row" key={level}>
                    <div className="category-multiselect">
                      <span className="category-label">Категория {level}</span>
                      <div
                        className={`category-select-trigger ${openCategoryLevel === level ? "is-open" : ""}`}
                      >
                        {(categorySelections[level] ?? []).length > 0 && (
                          <div className="category-counter">
                            <span>{categorySelections[level].length}</span>
                            <button
                              type="button"
                              aria-label="Очистить выбранные категории"
                              onClick={() =>
                                setCategorySelections((current) => ({ ...current, [level]: [] }))
                              }
                            >
                              <img src={`${assets}/e1950.svg`} alt="" />
                            </button>
                          </div>
                        )}
                        <button
                          className="category-select-toggle"
                          type="button"
                          aria-label={`Выбрать категории уровня ${level}`}
                          aria-haspopup="listbox"
                          aria-expanded={openCategoryLevel === level}
                          onClick={() =>
                            setOpenCategoryLevel((current) => (current === level ? null : level))
                          }
                        >
                          <span />
                          <img src={`${assets}/fd2eb.svg`} alt="" />
                        </button>
                      </div>
                      {openCategoryLevel === level && (
                        <div
                          className="category-options"
                          role="listbox"
                          aria-label={`Категории уровня ${level}`}
                          aria-multiselectable="true"
                        >
                          {categoryOptionsByLevel[level].map((category) => {
                            const selected = (categorySelections[level] ?? []).includes(category);
                            return (
                              <button
                                type="button"
                                role="option"
                                aria-selected={selected}
                                key={category}
                                onClick={() => toggleCategory(level, category)}
                              >
                                <span className={`option-check ${selected ? "is-checked" : ""}`} />
                                {category}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {(categorySelections[level] ?? []).length > 0 && (
                        <div className="selected-category-tags">
                          {categorySelections[level].map((category) => (
                            <button
                              className="selected-category-tag"
                              type="button"
                              key={category}
                              aria-label={`Отменить выбор: ${category}`}
                              onClick={() => toggleCategory(level, category)}
                            >
                              <span>{category}</span>
                              <img src={`${assets}/e1950.svg`} alt="" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="category-actions">
                      <button
                        className="category-action paste-action"
                        type="button"
                        aria-label="Вставить списком"
                      >
                        <img src={`${assets}/6851c.svg`} alt="" />
                        <span className="action-tooltip">
                          Вставить списком
                          <img src={`${assets}/008ea.svg`} alt="" />
                        </span>
                      </button>
                      <button
                        className="category-action"
                        type="button"
                        aria-label="Удалить поле"
                        onClick={() => {
                          setCategoryLevels((current) => current.filter((item) => item !== level));
                          setCategorySelections((current) => {
                            const next = { ...current };
                            delete next[level];
                            return next;
                          });
                          if (openCategoryLevel === level) setOpenCategoryLevel(null);
                        }}
                      >
                        <img src={`${assets}/67df9.svg`} alt="" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="category-menu" ref={categoryMenu}>
                  <button
                    className={`outline-action menu-action ${categoryMenuOpen ? "is-open" : ""}`}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={categoryMenuOpen}
                    onClick={() => setCategoryMenuOpen((current) => !current)}
                  >
                    Добавить уровень
                    <img src={`${assets}/${categoryMenuOpen ? "a049a.svg" : "fd2eb.svg"}`} alt="" />
                  </button>
                  {categoryMenuOpen && (
                    <div className="category-menu-dropdown" role="menu">
                      {[1, 2, 3, 4].map((level) => {
                        const alreadyAdded = categoryLevels.includes(level);
                        return (
                          <button
                            type="button"
                            role="menuitem"
                            key={level}
                            disabled={alreadyAdded}
                            onClick={() => {
                              setCategoryLevels((current) =>
                                [...current, level].sort((first, second) => first - second),
                              );
                              setCategoryMenuOpen(false);
                            }}
                          >
                            {level}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-divider" />

              <div className="fieldset">
                <div className="products-heading">
                  <h3>Товары</h3>
                  {uploadedFile && (
                    <button
                      type="button"
                      aria-label="Удалить загруженный список"
                      onClick={() => setUploadedFile("")}
                    >
                      <img src={`${assets}/67df9.svg`} alt="" />
                    </button>
                  )}
                </div>
                {uploadedFile ? (
                  <>
                    <div className="products-added">
                      <span>Добавлено: 25 000 GUID</span>
                      <a
                        href={`${import.meta.env.BASE_URL}downloads/guid-exclusions.xlsx`}
                        download="guid-exclusions.xlsx"
                        aria-label="Скачать список GUID"
                      >
                        <img src={`${assets}/e281e.svg`} alt="" />
                      </a>
                    </div>
                    <button
                      className="outline-action upload-action"
                      type="button"
                      onClick={() => setUploadModalOpen(true)}
                    >
                      <img src={`${assets}/05424.svg`} alt="" />
                      Заменить список
                    </button>
                  </>
                ) : (
                  <button
                    className="outline-action upload-action"
                    type="button"
                    onClick={() => setUploadModalOpen(true)}
                  >
                    <img src={`${assets}/05424.svg`} alt="" />
                    Загрузить
                  </button>
                )}
              </div>
            </section>
          </form>
        )}
      </div>
      {uploadModalOpen && (
        <div
          className="upload-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setUploadModalOpen(false);
              setPendingUpload(null);
            }
          }}
        >
          <section
            className="upload-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-modal-title"
          >
            <header className="upload-modal-header">
              <h2 id="upload-modal-title">Загрузка исключений</h2>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => {
                  setUploadModalOpen(false);
                  setPendingUpload(null);
                }}
              >
                <img src={`${assets}/e1950.svg`} alt="" />
              </button>
            </header>
            <div className="upload-modal-body">
              <div className="upload-modal-copy">
                <h3>Загрузи файл с GUID для исключения</h3>
                <p>Формат .xlsx, не больше 100 000 строк</p>
              </div>
              <label className="outline-action choose-file-button">
                <img src={`${assets}/05424.svg`} alt="" />
                Выбрать файл
                <input
                  type="file"
                  onChange={(event) => setPendingUpload(event.target.files?.[0] ?? null)}
                />
              </label>
              {pendingUpload && <p className="pending-file-name">{pendingUpload.name}</p>}
            </div>
            <footer className="upload-modal-footer">
              <button
                className="modal-cancel-button"
                type="button"
                onClick={() => {
                  setUploadModalOpen(false);
                  setPendingUpload(null);
                }}
              >
                Отменить
              </button>
              <button
                className="modal-upload-button"
                type="button"
                disabled={!pendingUpload}
                onClick={() => {
                  if (!pendingUpload) return;
                  setUploadedFile(pendingUpload.name);
                  setPendingUpload(null);
                  setUploadModalOpen(false);
                }}
              >
                Загрузить
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

const columns = [
  ["ID", "100px"],
  ["Статус", "180px"],
  ["Стандарт", "200px"],
  ["Сегмент", "200px"],
  ["Надбавка", "124px"],
  ["КЦ", "100px"],
  ["Активация", "132px"],
  ["Создано", "minmax(140px, 1fr)"],
];

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<"list" | "form" | "card">("list");
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [rules, setRules] = useState<Rule[]>([]);
  const [notice, setNotice] = useState("");

  const openRuleForm = () => {
    setSelectedRuleId(null);
    setView("form");
    setMobileMenuOpen(false);
  };

  const openRuleCard = (ruleId: number) => {
    setSelectedRuleId(ruleId);
    setView("card");
    setMobileMenuOpen(false);
  };

  const closeRuleView = () => {
    setSelectedRuleId(null);
    setView("list");
  };

  const saveRule = (values: RuleFormValues) => {
    const nextId = rules.length + 1;
    setRules((current) => [
      ...current,
      {
        id: nextId,
        status: values.status,
        standard: values.standard,
        segment: values.segment,
        markup: `${values.markup}%`,
        kc: "—",
        activation: values.activation,
        created: new Intl.DateTimeFormat("ru-RU").format(new Date()),
        beautifulPrice: values.beautifulPrice,
        attributes: values.attributes,
        categoryLevels: values.categoryLevels,
        categorySelections: values.categorySelections,
        uploadedFile: values.uploadedFile,
      },
    ]);
    setNotice(`Правило ${nextId} создано`);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const updateRule = (ruleNumber: number, values: RuleFormValues) => {
    setRules((current) =>
      current.map((rule) =>
        rule.id === ruleNumber
          ? {
              ...rule,
              status: values.status,
              markup: `${values.markup}%`,
              activation: values.activation,
              beautifulPrice: values.beautifulPrice,
              attributes: values.attributes,
              categoryLevels: values.categoryLevels,
              categorySelections: values.categorySelections,
              uploadedFile: values.uploadedFile,
            }
          : rule,
      ),
    );
    setNotice(`Правило ${ruleNumber} обновлено`);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const selectedRule = rules.find((rule) => rule.id === selectedRuleId);

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={view === "form" || sidebarCollapsed}
        compact={view === "form"}
        mobileOpen={mobileMenuOpen}
        onCollapse={() => setSidebarCollapsed((value) => !value)}
        onClose={() => setMobileMenuOpen(false)}
      />

      {view === "form" ? (
        <RuleForm
          onBack={closeRuleView}
          onSave={saveRule}
          onUpdate={updateRule}
          ruleNumber={rules.length + 1}
        />
      ) : view === "card" && selectedRule ? (
        <RuleForm
          key={selectedRule.id}
          initialRule={selectedRule}
          onBack={closeRuleView}
          onSave={saveRule}
          onUpdate={updateRule}
          ruleNumber={rules.length + 1}
        />
      ) : (
        <main className="main-area">
          <header className="page-header">
            <button
              className="mobile-menu-button"
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <span />
              <span />
              <span />
            </button>
            <h1>Правила по сегментам</h1>
            <button className="primary-button" type="button" onClick={openRuleForm}>
              <img src={`${assets}/81884.svg`} alt="" />
              Создать
            </button>
          </header>

          <section className="content-grid">
            <div className="rules-card">
              <div className="toolbar">
                <h2>Правила</h2>
                <div className="filter-control">
                  <button
                    className={`icon-button ${filtersVisible ? "is-active" : ""}`}
                    type="button"
                    onClick={() => setFiltersVisible((value) => !value)}
                    aria-label={filtersVisible ? "Скрыть фильтры" : "Показать фильтры"}
                  >
                    <img src={`${assets}/5c630.svg`} alt="" />
                  </button>
                  <span className="tooltip">Фильтры</span>
                </div>
              </div>

              {filtersVisible && (
                <div className="filter-bar">
                  <Dropdown
                    label="Фильтр по стандарту"
                    options={["Стандарт", "Стандарт 1", "Стандарт 2"]}
                    value="Стандарт"
                    interactive={false}
                  />
                  <Dropdown
                    label="Фильтр по сегменту"
                    options={["Сегмент", "Новые клиенты", "Постоянные клиенты"]}
                    value="Сегмент"
                    interactive={false}
                  />
                </div>
              )}

              <div className="table-shell">
                <div
                  className="table-header"
                  style={{ gridTemplateColumns: columns.map((column) => column[1]).join(" ") }}
                >
                  {columns.map(([title]) => (
                    <div key={title}>{title}</div>
                  ))}
                </div>

                <div className="table-body">
                  {rules.length === 0 ? (
                    <div className="empty-state">
                      <img src={`${assets}/18a46.svg`} alt="" />
                      <div className="empty-copy">
                        <h3>Правил пока нет</h3>
                        <p>Они отобразятся тут после создания</p>
                      </div>
                      <button className="secondary-button" type="button" onClick={openRuleForm}>
                        <img src={`${assets}/81884.svg`} alt="" />
                        Создать
                      </button>
                    </div>
                  ) : (
                    <div className="rule-rows">
                      {rules.map((rule) => (
                        <div
                          className="rule-row"
                          key={rule.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`Открыть карточку правила ${rule.id}`}
                          onClick={() => openRuleCard(rule.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              openRuleCard(rule.id);
                            }
                          }}
                          style={{
                            gridTemplateColumns: columns.map((column) => column[1]).join(" "),
                          }}
                        >
                          <div>{rule.id}</div>
                          <div>
                            <span className="status-pill">{rule.status}</span>
                          </div>
                          <div>{rule.standard}</div>
                          <div>{rule.segment}</div>
                          <div>{rule.markup}</div>
                          <div>{rule.kc}</div>
                          <div>{rule.activation ? formatDateValue(rule.activation) : "Сразу"}</div>
                          <div>{rule.created}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <footer className="pagination">{rules.length} правил</footer>
            </div>
          </section>
        </main>
      )}

      {notice && (
        <div className="toast" role="status">
          <img src={`${assets}/3e329.svg`} alt="" />
          {notice}
        </div>
      )}
    </div>
  );
}
