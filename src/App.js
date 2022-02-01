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

  useEffect(async () => {
    const response = await axios.get('http://178.128.196.163:3000/api/records');
    const arrData  = await response.data
    await setData(arrData)
  }, [idCanche]);

  const handleClickAdd = async () => {
    //const id = _.uniqueId();
    //const _v = 0;
    const name = '';
    const surname = '';
    const telephone = '';
    const address = '';
    const email = '';
    const data = {name, surname, telephone, address, email}
    const result =  {data};
    await axios.put('http://178.128.196.163:3000/api/records', result);
    const response = await axios.get('http://178.128.196.163:3000/api/records');
      try {
        const arrData  = await response.data
        setData(arrData)
      } catch (e) {
        console.log(e)
      }
    console.log('конец события добавления')
  }

  const handleClickDelete = (idElement) => async (e) => {
    console.log('удаление')
    console.log(idElement)
    const response = await axios.delete(`http://178.128.196.163:3000/api/records/${idElement}`);
    try {
      if (response.data === true) {
        console.log('данные успешно удалены')
        setData(dataRes.filter((el) => el._id !== idElement))
        return
      }
      console.log(`не удалось  удалить`)
    } catch(e) {
      console.log(`неизвестная ошибка ${e}`)
    }
  };
  
  const handleClickSave = (id) => async () =>  {
    const el = dataRes.filter(({_id}) => id === _id)[0]
    const response = await axios.post(`http://178.128.196.163:3000/api/records/${id}`, el);
    try {
      console.log(response)
      console.log('успешно добавлен')
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
      const status = id === idCanche ? false : true;

      const buttonChangSave = (status === true ? <button style={{'background-color': '#feff68'}} onClick={() => setIdCanche(id)}>{'изменить'}</button> : <button style={{'background-color': '#00c70f'}} onClick={handleClickSave(id, obj)}>{'сохранить'}</button>);

      const buttonDelete = (<button style={{'background-color': '#ff2e2c'}} onClick={handleClickDelete(id)}>{'удалить'}</button>);

      const itemsDom = keysItems.map((key) => {

        const handlerOchangItem = (e) => {
          const newAarr = items.map((elData) => {
            if (elData._id === id ) {
              const newData = elData.data ?? {}
              newData[key] = e.target.value;
              elData.data = newData
              console.log(elData)
              return elData
            }
          
            return elData
          })
          setData(newAarr)
        };

        const value = obj[key] ?? '';
        return <th> <input disabled={status} onChange={handlerOchangItem} type={[key]} value={value}></input></th>  
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
