import { Link } from "react-router-dom"
import { useState } from "react"

import DopForm from "../components/DopForm";
import SiteForm from "../components/SiteForm";

import "./horizontalTabs.css";

const QaForm = () => {
  const [active, setActive] = useState("tab1");

  return (
    <div>
      <Link to="/dop-work">Таблица</Link>
        <div className="tabs-container">
          <div className="tab-list" role="tablist" aria-label="Simple horizontal tabs">
          <button
          role="tab"
          aria-selected={active === "tab1"}
          onClick={() => setActive("tab1")}
          className={`tab-button ${active === "tab1" ? "active" : ""}`}
          >
          Доп. Работы
          </button>


          <button
          role="tab"
          aria-selected={active === "tab2"}
          onClick={() => setActive("tab2")}
          className={`tab-button ${active === "tab2" ? "active" : ""}`}
          >
          Проверка сайтов
          </button>
          </div>


          <div className="tab-content">
          {active === "tab1" && (
          <div role="tabpanel"><DopForm /></div>
          )}


          {active === "tab2" && (
          <div role="tabpanel"><SiteForm /></div>
          )}
          </div>
        </div>
    </div>
  )
}

export default QaForm
