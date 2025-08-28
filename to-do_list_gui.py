import tkinter as tk
from tkinter import messagebox
import json
import os

TASKS_FILE = "tasks.json"


# -------- Data Handling --------
def load_tasks():
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, "r") as f:
            return json.load(f)
    return []


def save_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=4)


# -------- GUI App --------
class ToDoApp:
    def __init__(self, root):
        self.root = root
        self.root.title("To-Do List ✅")
        self.root.geometry("400x500")

        # Load tasks
        self.tasks = load_tasks()

        # Entry for new task
        self.task_entry = tk.Entry(root, font=("Arial", 14))
        self.task_entry.pack(pady=10, padx=10, fill=tk.X)

        # Buttons frame
        btn_frame = tk.Frame(root)
        btn_frame.pack(pady=5)

        self.add_btn = tk.Button(btn_frame, text="Add Task", width=10, command=self.add_task)
        self.add_btn.grid(row=0, column=0, padx=5)

        self.done_btn = tk.Button(btn_frame, text="Mark Done", width=10, command=self.mark_done)
        self.done_btn.grid(row=0, column=1, padx=5)

        self.del_btn = tk.Button(btn_frame, text="Delete Task", width=10, command=self.delete_task)
        self.del_btn.grid(row=0, column=2, padx=5)

        # Listbox for tasks
        self.task_listbox = tk.Listbox(root, font=("Arial", 14), selectmode=tk.SINGLE, height=15)
        self.task_listbox.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)

        # Populate tasks
        self.refresh_listbox()

        # Save tasks when window closes
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)

    # --- Functions ---
    def refresh_listbox(self):
        self.task_listbox.delete(0, tk.END)
        for task in self.tasks:
            status = "✔️" if task["done"] else "❌"
            self.task_listbox.insert(tk.END, f"{task['title']} {status}")

    def add_task(self):
        title = self.task_entry.get().strip()
        if title:
            self.tasks.append({"title": title, "done": False})
            self.task_entry.delete(0, tk.END)
            self.refresh_listbox()
        else:
            messagebox.showwarning("Warning", "Task cannot be empty!")

    def mark_done(self):
        selection = self.task_listbox.curselection()
        if selection:
            index = selection[0]
            self.tasks[index]["done"] = True
            self.refresh_listbox()
        else:
            messagebox.showwarning("Warning", "Select a task to mark done!")

    def delete_task(self):
        selection = self.task_listbox.curselection()
        if selection:
            index = selection[0]
            removed = self.tasks.pop(index)
            self.refresh_listbox()
            messagebox.showinfo("Deleted", f"Removed: {removed['title']}")
        else:
            messagebox.showwarning("Warning", "Select a task to delete!")

    def on_close(self):
        save_tasks(self.tasks)
        self.root.destroy()


# -------- Run App --------
if __name__ == "__main__":
    root = tk.Tk()
    app = ToDoApp(root)
    root.mainloop()
