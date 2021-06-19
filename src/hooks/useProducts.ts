import { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../helper/auth';

const productUrl = process.env.REACT_APP_PRODUCTS_URL || '/api/product';

const initialState = {
  name: '',
  description: '',
  price: 0,
  inStock: 0,
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  inStock: number;
  image: string;
};

export const isNew = (id: string) => id === 'new';

export const useProducts = (id?: string) => {
  const [data, setData] = useState([]);
  const [single, setSingle] = useState<Record<string, any>>(initialState);

  const getSingle = async (id: string) => {
    if (!isNew(id)) {
      const response = await axios.get(`${productUrl}/${id}`, authHeader());
      setSingle({ ...response.data });
    }
  };

  const getData = async () => {
    const response = await axios.get(productUrl, authHeader());
    setData(response.data);
  };

  const destroy = async (id: string) => {
    await axios.delete(`${productUrl}/${id}`, authHeader());
    getData();
  };

  const create = async (formData: FormData) => {
    await axios.post(`${productUrl}`, formData, authHeader());
  };

  const edit = async () => {
    axios.put(`${productUrl}/${id}`, { ...single }, authHeader());
  };

  const changeImage = async (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    return axios.patch(`${productUrl}/${id}/changeImage`, formData, authHeader());
  };

  useEffect(() => {
    getData();
    if (id && !isNew(id)) {
      getSingle(id);
    }
  }, [id]);

  return {
    data,
    destroy,
    create,
    edit,
    single,
    setSingle,
    changeImage,
  };
};
