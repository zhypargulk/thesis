import React from "react";
import { DragDropContext, DropTarget, DragSource } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import {
  getAllTasksBoard,
  updateTaskStatus,
  uploadTheTask,
} from "../../controller/Tasks";
import { InputTextarea } from "primereact/inputtextarea";
import { getDocumentById } from "../../controller/Courses";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "./Kanban.css";

const labels = ["new", "going", "done"];
const labelsMap = {
  new: "To Do",
  going: "In Progress",

  done: "Done",
};

const classes = {
  board: {
    display: "flex",
    width: "60vw",
    fontFamily: 'Arial, "Helvetica Neue", sans-serif',
  },
  column: {
    minWidth: 100,
    width: "20vw",
    height: "80vh",
    margin: "0 auto",
    backgroundColor: "#E5E4E2",
    borderColor: "#AC6CFF",
    borderStyle: "solid",
  },
  columnHead: {
    textAlign: "center",
    padding: 10,
    fontSize: "2rem",
    backgroundColor: "#AC6CFF",
    color: "white",
  },
  item: {
    padding: "10px",
    margin: "10px 0",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#FBEBD7",
    borderColor: "#AC6CFF",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "box-shadow 0.3s ease-in-out",
  },

  itemHover: {
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  },

  userName: {
    display: "block",
    marginTop: "8px",
    fontSize: "0.85rem",
    color: "#333",
    fontWeight: "bold",
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
    let fetchedTasks = await getAllTasksBoard(groupId);

    console.log(fetchedTasks);
    const tasksWithUserNames = await Promise.all(
      fetchedTasks.map(async (task) => {
        try {
          const userData = await getDocumentById("user", task.user_id);
          return {
            ...task,
            userName: userData ? userData.name : "Unknown",
          };
        } catch (error) {
          console.error("Error fetching user name:", error);
          return { ...task, userName: "Unknown" };
        }
      })
    );

    this.setState({ tasks: tasksWithUserNames });
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

    const updatedTasksStatus = updateTaskStatus(
      newTasks[taskIndex]._id,
      newTasks[taskIndex].status
    );
    this.setState({ tasks: newTasks });
  };

  render() {
    const { tasks } = this.state;
    const { id: groupId } = this.props;

    return (
      <>
        <div>
          <h3 className="mt-4 ml-5 text-3xl text-white">Progress board</h3>

          <div className="ml-5 mr-4">
            <section style={classes.board}>
              {labels.map((channel) => (
                <KanbanColumn status={channel}>
                  <div style={classes.column}>
                    <div style={classes.columnHead}>{labelsMap[channel]}</div>
                    <div>
                      {tasks
                        .filter((item) => item.status === channel)
                        .map((item) => (
                          <KanbanItem
                            id={item._id}
                            onDrop={this.update}
                            userName={item.userName}
                            title={item.title}
                            description={item.description}
                            status={item.status}
                          >
                            <div>{item.title}</div>
                          </KanbanItem>
                        ))}
                    </div>
                  </div>
                </KanbanColumn>
              ))}
            </section>
          </div>
        </div>
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
      props.onDrop(item.name, dropResult.name);
    }
  },
};

class KanbanItem extends React.Component {
  state = {
    isHovered: false,
    showDialog: false,
    codeText: "",
    codeSubmitted: false,
  };

  componentDidMount() {
    this.check();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.check();
    }
  }

  toggleHover = () => {
    this.setState((prevState) => ({ isHovered: !prevState.isHovered }));
  };

  toggleDialog = () => {
    this.setState((prevState) => ({ showDialog: !prevState.showDialog }));
  };

  handleCodeChange = (e) => {
    this.setState({ codeText: e.target.value });
  };

  check = async () => {
    const { id } = this.props;
    try {
      const task = await getDocumentById("tasks", id);
      if (task && task.code) {
        this.setState({ codeSubmitted: true });
        this.setState({ codeText: task.code });
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  uploadCode = async () => {
    const { id } = this.props;
    const { codeText } = this.state;

    try {
      const response = await uploadTheTask(id, codeText);
      this.setState({ codeSubmitted: true });
      this.setState({ codeText: response.code });
      this.toggleDialog();
    } catch (error) {
      console.error("Failed to upload code:", error);
    }
  };

  render() {
    const { isHovered, showDialog, codeText, codeSubmitted } = this.state;
    const { title, userName, description, status } = this.props;
    const dialogFooter = (
      <div>
        {codeSubmitted ? (
          <span style={{ color: "green" }}>Code submitted successfully!</span>
        ) : (
          <Button
            label="Submit Code"
            icon="pi pi-upload"
            onClick={this.uploadCode}
            className="p-button-text"
          />
        )}
        <Button
          label="Close"
          icon="pi pi-times"
          onClick={this.toggleDialog}
          className="p-button-text"
        />
      </div>
    );

    return this.props.connectDragSource(
      <div
        style={{ ...classes.item, ...(isHovered ? classes.itemHover : {}) }}
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
      >
        <div>{this.props.children}</div>
        <span style={classes.userName}>{userName}</span>
        {status !== "done" ? (
          <Button
            label="Details"
            icon="pi pi-info-circle"
            onClick={this.toggleDialog}
            className="p-button-text text-button"
          />
        ) : (
          <Button
            label={codeSubmitted ? "Code submitted!" : "Submit Code"}
            icon={codeSubmitted ? "pi pi-check" : "pi pi-upload"}
            onClick={this.toggleDialog}
            className="p-button-text text-button"
          />
        )}
        <Dialog
          header={status !== "done" ? "Task Details" : "Submit Code"}
          visible={showDialog}
          style={{ width: "50vw" }}
          footer={
            !codeSubmitted ? (
              dialogFooter
            ) : (
              <Button className="" onClick={this.uploadCode}>
                Resubmit the code
              </Button>
            )
          }
          onHide={this.toggleDialog}
        >
          {status !== "done" ? (
            <p>{description}</p>
          ) : (
            <InputTextarea
              value={codeText}
              onChange={this.handleCodeChange}
              rows={5}
              cols={30}
            />
          )}
        </Dialog>
      </div>
    );
  }
}

KanbanItem = DragSource("kanbanItem", boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(KanbanItem);
