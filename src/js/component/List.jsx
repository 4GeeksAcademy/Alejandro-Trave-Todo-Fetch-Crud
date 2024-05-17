import React, { useState, useEffect } from "react";

const List = () => {
    const [inputValue, setInputValue] = useState('');
    const [todos, setTodos] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const host = 'https://playground.4geeks.com/todo';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(`${host}/users/Pepito`);
        if (response.ok) {
            const data = await response.json();
            setTodos(data.todos.map(todo => ({ id: todo.id, label: todo.label })));
        } else {
            console.error('Error al traer datos:', response.statusText);
        }
    };

    const addTodo = async () => {
        try {
            const response = await fetch(`${host}/todos/Pepito`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    label: inputValue,
                    is_done: false
                })
            });
            if (response.ok) {
                const data = await response.json();
                setTodos([...todos, { id: data.id, label: inputValue }]);
                setInputValue('');
                alert("Tarea añadida a Playground");
            } else {
                console.error('Error al añadir tarea:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const editTodo = async (id) => {
            const response = await fetch(`${host}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    label: editValue,
                    is_done: false
                })
            });
            if (response.ok) {
                const data = await response.json();
                setTodos(todos.map(todo => (todo.id === id ? { ...todo, label: data.label } : todo)));
                setEditMode(false);
                setEditId(null);
                setEditValue('');
                alert("Tarea editada en Playground");
            } else {
                console.error('Error al editar tarea:', response.statusText);
            }
    };

    const handleEdit = (id, currentLabel) => {
        setEditMode(true);
        setEditId(id);
        setEditValue(currentLabel);
    };

    const eraseTodo = async (id) => {
        try {
            const response = await fetch(`${host}/todos/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setTodos(todos.filter(todo => todo.id !== id));
                alert("Tarea borrada también de Playground");
            } else {
                console.error('Error al borrar tarea:', response.statusText);
            }
        } catch (error) {
            console.error('Error al borrar tarea:', error);
        }
    };

    const eraseAll = async () => {
        for (const todo of todos) {
            const response = await fetch(`${host}/todos/${todo.id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                console.error('Error al borrar todo:', response.statusText);
            }
        }
        setTodos([]);
        alert("Todas las tareas han sido borradas también de Playground");
    };

    return (
        <div className="col d-flex justify-content-center list">
            <form>
                <div className="row shadow p-3 rounded">
                    <input
                        type="text"
                        onChange={e => setInputValue(e.target.value)}
                        value={inputValue}
                        placeholder="Añadir nueva tarea"
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTodo();
                            }
                        }}
                    />
                </div>
                {todos.map(todo => (
                    <div key={todo.id} className="row shadow todos">
                        {editMode && editId === todo.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary me-1"
                                    onClick={() => editTodo(todo.id)}
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={() => {
                                        setEditMode(false);
                                        setEditId(null);
                                        setEditValue('');
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <p className="item">
                                {todo.label}
                                <span onClick={() => eraseTodo(todo.id)} className="float-end p-0 m-0 erase">x</span>
                                <span onClick={() => handleEdit(todo.id, todo.label)} className="float-end p-0 mt-2 me-2 edit"><i className="far fa-edit"></i></span>
                            </p>
                        )}
                    </div>
                ))}
                <div className="row shadow-sm foot">
                    <p className="m-1">{todos.length} {todos.length === 1 ? 'tarea' : 'tareas'} por hacer</p>
                </div>
            </form>
            <div>
                <button type="button" onClick={eraseAll} className="btn btn-danger ms-5">Borrar todo</button>
            </div>
        </div>
    );
    
};    
export default List;
