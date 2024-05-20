import React from "react";
import { DragDropContext, DropTarget, DragSource } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import {
  updateTaskStatus,
  uploadTheTask,
  getAllTasks,
} from "../../controller/Tasks";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Message } from "primereact/message";

import { getDocumentById } from "../../controller/Courses";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";
import "./Kanban.css";

const labels = ["new", "going", "done"];
const labelsMap = {
  new: "TO DO",
  going: "IN PROGRESS",
  done: "DONE",
};

const classes = {
  board: {
    display: "flex",
    width: "60vw",
  },
  column: {
    minWidth: 100,
    width: "20vw",
    height: "60vh",
    margin: "0 auto",
    backgroundColor: "#ffff",
    borderColor: "black",
    borderStyle: "solid",
  },
  columnHead: {
    textAlign: "center",
    padding: 10,
    fontSize: "1rem",
    backgroundColor: "black",
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
    let fetchedTasks = await getAllTasks(groupId);

    const tasksWithUserNames = await Promise.all(
      fetchedTasks.map(async (task) => {
        try {
          const userData = await getDocumentById("user", task.userRef.id);
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

  allTasksDone = () => {
    const { tasks } = this.state;
    return tasks.every((task) => task.status === "done");
  };

  render() {
    const { tasks } = this.state;
    const { id: groupId } = this.props;
    const navigate = this.props.navigate;
    const docId = this.props.docId;

    return (
      <>
        <div>
          <div className="flex flex-row">
            <Button
              label="Add task"
              className="ml-5 h-2rem mt-2"
              icon="pi pi-plus"
              onClick={() => navigate(`/groups/${docId}`)}
            />
          </div>

          <div className="ml-5 mr-4 mt-2">
            <section style={classes.board}>
              {labels.map((channel) => (
                <KanbanColumn status={channel} key={channel}>
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
                            key={item._id}
                          >
                            <div>{item.title}</div>
                          </KanbanItem>
                        ))}
                    </div>
                  </div>
                </KanbanColumn>
              ))}
            </section>
            {this.allTasksDone() && (
              <div className="run-project-container">
                <Button
                  label="Run Project"
                  className="mt-4"
                  icon="pi pi-play"
                  onClick={() => navigate(`/groups/${docId}/ide`)}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

const KanbanWithRouter = (props) => {
  const navigate = useNavigate();
  const { docId } = useParams();

  return <Kanban {...props} navigate={navigate} docId={docId} />;
};

export default DragDropContext(HTML5Backend)(KanbanWithRouter);

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
    this.setState({ codeText: e });
  };

  check = async () => {
    const { id } = this.props;

    try {
      const task = await getDocumentById("tasks", id);
      if (task && task.code) {
        this.setState({
          codeSubmitted: true,
          codeText: task.code,
        });
      } else {
        this.setState({
          codeSubmitted: false,
          codeText: "",
        });
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      this.setState({
        codeSubmitted: false,
        codeText: "",
      });
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
        {status === "done" && !codeSubmitted && (
          <Button
            label="Submit Code"
            icon="pi pi-upload"
            onClick={this.uploadCode}
            className="p-button-text"
          />
        )}
        {codeSubmitted && (
          <span style={{ color: "green" }}>Code submitted successfully!</span>
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
          style={{ width: "80vw", height: "50vw" }}
          footer={
            !codeSubmitted ? (
              dialogFooter
            ) : (
              <>
                <Message severity="success" text="Success Message" />
                <Button className="" onClick={this.uploadCode}>
                  Resubmit the code
                </Button>
              </>
            )
          }
          onHide={this.toggleDialog}
        >
          {status !== "done" ? (
            <p>{description}</p>
          ) : (
            <CodeMirror
              value={codeText}
              height="600px"
              theme={vscodeDark}
              onChange={this.handleCodeChange}
              rows={20}
              cols={100}
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
