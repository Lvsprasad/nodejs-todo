const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const format = require("date-fns/format");

const app = express();
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error : ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

function convertTodo(todo) {
  return {
    id: todo.id,
    todo: todo.todo,
    priority: todo.priority,
    category: todo.category,
    status: todo.status,
    dueDate: format(nwe Date(todo.due_date),'yyyy-MM-dd')
  };
}

app.get("/todos/", async (request, response) => {
  try {
    const { status } = request.query;
    const getTodoStatusQuery = `SELECT * FROM todo WHERE status = '${status}`;
    const todo_array = await db.all(getTodoStatusQuery);
    response.send(todo_array.map((todo) => convertTodo(todo)));
  } catch (error) {
    response.status(400);
    response.send("Invalid Todo Status");
  }
});

app.get("/todos/", async (request, response) => {
  try {
    const { priority } = request.query;
    const getTodoStatusQuery = `SELECT * FROM todo WHERE priority = '${priority}'`;
    const todo_array = await db.all(getTodoStatusQuery);
    response.send(todo_array.map((todo) => convertTodo(todo)));
  } catch (error) {
    response.status(400);
    response.send("Invalid Todo Priority");
  }
});

app.get("/todos/", async (request, response) => {
  try {
    const { priority,status } = request.query;
    const getTodoStatusQuery = `SELECT * FROM todo WHERE priority = '${priority}' and status = '${status}'`;
    const todo_array = await db.all(getTodoStatusQuery);
    response.send(todo_array.map((todo) => convertTodo(todo)));
  } catch (error) {
    response.status(400);
    response.send("Invalid Todo Status and Priority");
  }
});

app.get("/todos/", async (request, response) => {
  try {
    const { search_q } = request.query;
    const getTodoStatusQuery = `SELECT * FROM todo WHERE todo like '%${search_q}%'`;
    const todo_array = await db.all(getTodoStatusQuery);
    response.send(todo_array.map((todo) => convertTodo(todo)));
  } catch (error) {
    response.status(400);
    response.send("Invalid Todo search_q");
  }
});


app.get("/todos/", async (request, response) => {
  try {
    const { category,status } = request.query;
    const getTodoStatusQuery = `SELECT * FROM todo WHERE category = '${category}' and status = '${status}'`;
    const todo_array = await db.all(getTodoStatusQuery);
    response.send(todo_array.map((todo) => convertTodo(todo)));
  } catch (error) {
    response.status(400);
    response.send("Invalid Todo Status and Category");
  }
});

app.get("/todos/", async (request, response) => {
  try {
    const { category } = request.query;
    const getTodoStatusQuery = `SELECT * FROM todo WHERE category = '${category}'`;
    const todo_array = await db.all(getTodoStatusQuery);
    response.send(todo_array.map((todo) => convertTodo(todo)));
  } catch (error) {
    response.status(400);
    response.send("Invalid Todo Status");
  }
});

app.get("/todos/", async (request, response) => {
  try {
    const { category,priority } = request.query;
    const getTodoStatusQuery = `SELECT * FROM todo WHERE category = '${category}' and priority = '${priority}'`;
    const todo_array = await db.all(getTodoStatusQuery);
    response.send(todo_array.map((todo) => convertTodo(todo)));
  } catch (error) {
    response.status(400);
    response.send("Invalid Todo Status");
  }
});

app.get("/todos/:todoId/",async (request,response) => {
    try{
        const {todoId} = request.params;
        const query = `select * from todo where id = ${todoId}`;
        const todo = await db.get(query);
        response.send(convertTodo(todo)));
    }catch(error){
        response.status(400);
        response.send("Invalid Todo Id");
    }
});


app.get("/agenda",async (request,response) => {
    try{
        const {date} =request.query;
        const date = format(new Date(date),"yyyy-MM-dd");
        const dateQuery = `select * from todo where date = ${date}`;
        const todos = await db.all(dateQuery);
        response.send(todos.map(todo => convertTodo(todo)));
    }catch(error){
        response.status(400);
        response.send("Invalid Agenda");
    }
});


app.post("/todos/", async (request,response) => {
    try{
        const {id,todo,category,priority,status,due_date} = request.body;
        const postQuery = `insert into todo (id,todo,category,priority,status,due_date)
        values (${id},'${todo}','${category}','${priority}','${status}',${due_date})`;
        const response = await db.run(postQuery);
        response.send("Todo Successfully Added");
    }catch(error){
        response.status(400);
    }
})

//id=${id},todo='${todo}',category='${category}',priority='${priority}'
app.put("/todos/:todoId",async (request,response) => {
    const {todoId} = request.query;
    const {status} = request.body;
    const putQuery = `update todo set status='${status}' where id = ${todoId}`
    await db.run(putQuery);
    response.send("Status Updated");
});

app.put("/todos/:todoId",async (request,response) => {
    const {todoId} = request.query;
    const {priority} = request.body;
    const putQuery = `update todo set priority='${priority}' where id = ${todoId}`
    await db.run(putQuery);
    response.send("Priority Updated");
});

app.put("/todos/:todoId",async (request,response) => {
    const {todoId} = request.query;
    const {todo} = request.body;
    const putQuery = `update todo set todo='${todo}' where id = ${todoId}`
    await db.run(putQuery);
    response.send("Todo Updated");
});

app.put("/todos/:todoId",async (request,response) => {
    const {todoId} = request.query;
    const {category} = request.body;
    const putQuery = `update todo set category ='${category}' where id = ${todoId}`
    await db.run(putQuery);
    response.send("Category Updated");
});


app.put("/todos/:todoId",async (request,response) => {
    const {todoId} = request.query;
    const {dueDate} = request.body;
    const putQuery = `update todo set due_date ='${dueDate}' where id = ${todoId}`
    await db.run(putQuery);
    response.send("Due Date Updated");
});


app.delete("/todos/:todoId",async (request,response) => {
    const {todoId} = request.query;
    const deleteQuery = `delete from todo where id = ${todoId}`
    await db.run(deleteQuery);
    response.send("Todo Deleted");
});

module.exports = app;
