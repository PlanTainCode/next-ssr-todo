import React from 'react'
import axios from 'axios'
import { Checkbox, IconButton, Paper, Typography } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import { EditOutlined as Edit, DeleteOutlineOutlined as Delete, PlaylistAddCheck as Icon  } from '@mui/icons-material';

// const url = process.env.SERVER_URL;
// const url = "http://localhost:3000/api/task";

const url = `${process.env.API_URL}/api/task`;

export default function Home(props) {
  const [tasks, setTasks] = React.useState(props.tasks);
  const [task, setTask] = React.useState({task: ""});

  const handleChange = ({currentTarget: input}) => {
    input.value === ""
    ? setTask({task: ""})
    : setTask((prev) => ({...prev, task: input.value}));
  }

  const editTask = (id) => {
    const currentTask = tasks.filter((task) => task._id === id);
    setTask(currentTask[0]);
  }

  const addTask = async (e) => {
    e.preventDefault();
    try {
      if (task._id) {
        const {data} = await axios.put(url + "/" + task._id, {task: task.task});
        const originalTasks = [...tasks];
        const index = originalTasks.findIndex((t) => t._id === task._id);
        originalTasks[index] = data.data;
        setTasks(originalTasks);
        setTask({task: ""});
        console.log(data.message);
      } else {
        const {data} = await axios.post(`${url}`, task);
        setTasks((prev) => [...prev, data.data]);
        setTask({task: ""});
        console.log(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateTask = async (id) => {
		try {
			const originalTasks = [...tasks];
			const index = originalTasks.findIndex((t) => t._id === id);
			const { data } = await axios.put(url + "/" + id, {
				complited: !originalTasks[index].complited,
			});
			originalTasks[index] = data.data;
			setTasks(originalTasks);
			console.log(data.message);
		} catch (error) {
			console.log(error);
		}
	};

  const deleteTask = async (id) => {
    try {
      const {data} = await axios.delete(url + "/" + id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      console.log(data.message);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Typography variant='h1'><Icon /> PlanTain To-Do</Typography>
        <span></span>
      </header>
      <main className={styles.main}>
        <Paper elevation={1} className={styles.formPaper}>
          <form onSubmit={addTask} className={styles.form}>
            <input type="text" placeholder='Впишите задачу' value={task.task} onChange={handleChange} />
            <button type='submit'>{task._id ? "Обновить" : "Добавить"}</button>
          </form>
        </Paper>
        <Paper elevation={1} className={styles.taskBlock}>
          {tasks.map((task) => (
             <div className={styles.taskItem} key={task._id}>
              <div className={styles.titleTask}>
                <Checkbox checked={task.complited} onChange={() => updateTask(task._id)} />
                <Typography variant='inherit' className={task.complited ? styles.lineThrow : ""}>{task.task}</Typography>
              </div>
              <div className={styles.buttonsTask}>
                <IconButton onClick={() => editTask(task._id)}><Edit /></IconButton>
                <IconButton onClick={() => deleteTask(task._id)}><Delete /></IconButton>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <Typography variant='h2'>Пока нет задач</Typography>}
        </Paper>
      </main>
    </div>
  )
}


export const getServerSideProps = async () => {
  try {
    const { data } = await axios.get(url);
    return {
      props: {
        tasks: data.data
      }
    }
  } catch {
    return {
      props: {
        tasks: []
      }
    }
  }
  
  
}