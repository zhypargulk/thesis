import React from "react";
import { DragDropContext, DropTarget, DragSource } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import { getAllTasksBoard, updateTaskStatus } from "../controller/Tasks";
import MenuBarCustom from "../components/Menubar";

const labels = ["new", "going", "done"];
const labelsMap = {
  new: "To Do",
  going: "In Progress",

  done: "Done",
};

const classes = {
  board: {
    display: "flex",
    margin: "5rem 5rem 0",
    width: "60vw",
    fontFamily: 'Arial, "Helvetica Neue", sans-serif',
  },
  column: {
    minWidth: 200,
    width: "20vw",
    height: "80vh",
    margin: "0 auto",
    backgroundColor: "#ffff",
    borderColor: "#64a5ea",
    borderStyle: "solid",
  },
  columnHead: {
    textAlign: "center",
    padding: 10,
    fontSize: "2rem",
    backgroundColor: "#64a5ea",
    color: "white",
  },
  item: {
    padding: 10,
    margin: 10,
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "white",
    borderColor: "#64a5ea",
    borderStyle: "solid",
  },
};

class Kanban extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    };
  }

  async fetchTasks() {
    const { id: groupId } = this.props;
    const fetchedTasks = await getAllTasksBoard(groupId);
    this.setState({ tasks: fetchedTasks });
  }

  componentDidMount() {
    this.fetchTasks();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.fetchTasks();
    }
  }

  update = (id, status) => {
    const { tasks } = this.state;
    const task = tasks.find((task) => task._id === id);
    task.status = status;
    const taskIndex = tasks.indexOf(task);
    const newTasks = update(tasks, {
      [taskIndex]: { $set: task },
    });
    console.log("newTask", newTasks);
    const updatedTasksStatus = updateTaskStatus(
      newTasks[taskIndex]._id,
      newTasks[taskIndex].status
    );
    this.setState({ tasks: newTasks });
  };

  render() {
    const { tasks } = this.state;
    return (
      <>
        <MenuBarCustom />
        <main>
          <section style={classes.board}>
            {labels.map((channel) => (
              <KanbanColumn status={channel}>
                <div style={classes.column}>
                  <div style={classes.columnHead}>{labelsMap[channel]}</div>
                  <div>
                    {tasks
                      .filter((item) => item.status === channel)
                      .map((item) => (
                        <KanbanItem id={item._id} onDrop={this.update}>
                          <div style={classes.item}>{item.description}</div>
                        </KanbanItem>
                      ))}
                  </div>
                </div>
              </KanbanColumn>
            ))}
          </section>
        </main>
      </>
    );
  }
}

export default DragDropContext(HTML5Backend)(Kanban);

// Column

const boxTarget = {
  drop(props) {
    return { name: props.status };
  },
};

class KanbanColumn extends React.Component {
  render() {
    return this.props.connectDropTarget(<div>{this.props.children}</div>);
  }
}

KanbanColumn = DropTarget("kanbanItem", boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(KanbanColumn);

// Item

const boxSource = {
  beginDrag(props) {
    return {
      name: props.id,
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      props.onDrop(monitor.getItem().name, dropResult.name);
    }
  },
};

class KanbanItem extends React.Component {
  render() {
    return this.props.connectDragSource(<div>{this.props.children}</div>);
  }
}

KanbanItem = DragSource("kanbanItem", boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(KanbanItem);
