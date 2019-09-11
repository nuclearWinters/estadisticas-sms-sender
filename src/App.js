import React, { useState, useEffect } from 'react';
import './App.css';
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

function App() {
  let [fecha_inicio, set_fecha_inicio] = useState(null)
  let [fecha_fin, set_fecha_fin] = useState(null)
  let [total_envios, set_total_envios] = useState(0)
  let [selected, set_selected] = useState(0)
  let [total_etiqueta, set_total_etiqueta] = useState([])
  let [total_lada, set_total_lada] = useState([])
  let [total_dispositivo, set_total_dispositivo] = useState([])
  let [fechas, set_fechas] = useState("")

  useEffect(() => {
    const filter = () => {
    axios.get(`http://192.168.1.22:3002/checar_enviados?fechaInicio=${fecha_inicio.toISOString().split('T')[0]}&fechaFin=${fecha_fin.toISOString().split('T')[0]}`)
    .then(
      enviados => {
        set_fecha_inicio(null)
        set_fecha_fin(null)
        set_total_dispositivo(enviados.data.dispositivos)
        set_total_lada(enviados.data.lada)
        set_total_etiqueta(enviados.data.etiquetas)
        set_total_envios(enviados.data.total[0].total)
        set_fechas(`Del ${fecha_inicio.toISOString().split('T')[0]} al ${fecha_fin.toISOString().split('T')[0]}`)
      }
    ).catch(
      err => {
        set_fecha_inicio(null)
        set_fecha_fin(null)
      }
    )
  }
    if (fecha_fin && fecha_inicio) {
      filter()
    }
  }, [fecha_inicio, fecha_fin])

  const handleChangeInicio = (date) => {
    set_fecha_inicio(date)
  };

  const handleChangeFin = (date) => {
    set_fecha_fin(date)
  };
 
  const columns = [{
    Header: 'Nombre',
    accessor: 'name' // String-based value accessors!
  }, {
    Header: 'Total',
    accessor: 'total',
  }]

  return (
    <div>
      <div style={{textAlign: "center", fontSize: 18}}>Total envíos: <div style={{fontWeight: "bold"}}>{total_envios}</div></div>
      <div style={{textAlign: "center", fontSize: 16}}>Selecciona una fecha</div>
      <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10}}>
          <div style={{marginRight: "10px"}}>
            <DatePicker
              selected={fecha_inicio}
              onChange={handleChangeInicio}
            />
            <FontAwesomeIcon icon={faCalendarAlt} style={{marginLeft: "10px"}} />
          </div>
          <div style={{marginLeft: "10px"}}>
            <DatePicker
              selected={fecha_fin}
              onChange={handleChangeFin}
            />
            <FontAwesomeIcon icon={faCalendarAlt} style={{marginLeft: "10px"}} />
          </div>
      </div>
      <div style={{textAlign: "center", fontSize: 16, marginTop: 10}}>{fechas}</div>
      <div style={{width: "100%", display: "flex", flexDirection: "row"}}>
        {["Etiqueta", "Lada", "Dispositivo"].map((op, i) => 
          <div onClick={() => {
            set_selected(i)
          }} key={i} className="button2" style={{flex: 1, textAlign: "center", padding: "5px 0px", backgroundColor: selected === i ? "#3e8e41" : "", margin: "20px 30px", color: "white", fontWeight: "bold", fontSize: 18 }}>{op}</div>
        )}
      </div>
      <ReactTable
        data={[total_etiqueta, total_lada, total_dispositivo][selected]}
        columns={columns}
      />
    </div>
  );
}

export default App;
