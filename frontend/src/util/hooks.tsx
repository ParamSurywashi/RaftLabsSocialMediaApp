import { useState, ChangeEvent, FormEvent } from 'react';

export const useForm = <T extends Record<string, any>>(
  callback: () => void,
  initialState: T
) => {
  const [values, setValues] = useState<T>(initialState);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    callback();
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
