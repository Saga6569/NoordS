import './index.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

const getKeyAll = (obj) => {
  const arrKey =  Object.keys(obj)
  return arrKey.flatMap((key) => _.isObject(obj[key]) ? getKeyAll(obj[key]) : key );
};

const App = () => {

  const [idCanche, setIdCanche] = useState('')
  const [dataRes, setData] = useState([]);

  useEffect(async () => {
    const response = await axios.get('http://178.128.196.163:3000/api/records');
    const arrData  = await response.data
    await setData(arrData)
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const response = await axios.get('http://178.128.196.163:3000/api/records');
    const arrData  = await response.data
    setData(arrData)
  }, [idCanche]);

  const handleClickAdd = () => {
    const name = '';
    const surname = '';
    const telephone = '';
    const address = '';
    const email = '';
    const data = { name, surname, telephone, address, email}
    const result =  {data};
    setData([...dataRes, result])
  }

  const handleClickDelete = (idElement) => async (e) => {
    const response = await axios.delete(`http://178.128.196.163:3000/api/records/${idElement}`);
    try {
      if (response.data === true) {
        setData(dataRes.filter((el) => el._id !== idElement))
        return
      }
    } catch(e) {
      console.log(`неизвестная ошибка ${e}`)
    }
  };
  
  const handleClickSave = (id, elData) => async () =>  {
    if (id === undefined) {
      const data = {...elData}
      await axios.put('http://178.128.196.163:3000/api/records', {data});
      try {
        const response = await axios.get('http://178.128.196.163:3000/api/records');
        setData(response.data)
      } catch(e) {
        console.log(`неизвестная ошибка ${e}`)
      }
      return;
    }
    const el = dataRes.filter(({_id}) => id === _id)[0]
    await axios.post(`http://178.128.196.163:3000/api/records/${id}`, el);
    try {
      setIdCanche('')
    } catch(e) {
      console.log(`неизвестная ошибка ${e}`)
    }
}
  const newIter = (items) => {
   
    const keysItems = [...new Set(getKeyAll(items))].filter((el) => el !== '__v')

    const arrObject = items.map((item) => {
        const keys = Object.keys(item);
        return keys.reduce((acc, key) => {
          if (_.isObject(item[key])) {
            return { ...acc, ...(item[key]) };
          }
          return { ...acc, [key]: item[key] };
        }, {});
    });

    const result = arrObject.map((obj) => {
      const id = obj._id;
      const status = id === undefined || id === idCanche ? false : true;
      const buttonChangSave = (status === true ? <button style={{'background-color': '#feff68'}} onClick={() => setIdCanche(id)}>{'изменить'}</button> : <button style={{'background-color': '#00c70f'}} onClick={handleClickSave(id, obj)}>{'сохранить'}</button>);
      const buttonDelete = (<button style={{'background-color': '#ff2e2c'}} onClick={handleClickDelete(id)}>{'удалить'}</button>);
      const itemsDom = keysItems.map((key) => {
        const handlerOchangItem = (e) => {
          const newAarr = items.map((elData) => {
            if (elData._id === id ) {
              const newData = elData.data ?? {}
              newData[key] = e.target.value;
              elData.data = newData
              return elData
            }
            return elData
          })
          setData(newAarr)
        };

        const value = obj[key] ?? '';
        return <th> <input disabled={key === '_id' ? true : status } onChange={handlerOchangItem} type={[key]} value={value}></input></th>  
      })
      return [...itemsDom, buttonChangSave,  buttonDelete,]
    });

    return (
      <div>
        <tr>
          {keysItems.map((el) => <th>{el}</th>)}
        </tr>
        {result.map((el) => <tr>{el}</tr>)}
      </div>
    )
  };

    return (
      <div>
       {newIter(dataRes)}
        <button  style={{'background-color': '#00c70f'}} onClick={handleClickAdd}>добавить</button>
      </div>
     
     )
  }

export default App;
