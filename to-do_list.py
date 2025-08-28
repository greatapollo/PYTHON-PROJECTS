import json
import os

TASKS_FILE = "tasks.json"

def load_tasks():
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, "r") as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=4)

def show_tasks(tasks):
    if not tasks:
        print("\n✅ No tasks yet!\n")
        return
    print("\n📋 Your To-Do List:")
    for i, task in enumerate(tasks, start=1):
        status = "✔️" if task["done"] else "❌"
        print(f"{i}. {task['title']} [{status}]")
    print()

def add_task(tasks):
    title = input("Enter task: ").strip()
    if title:
        tasks.append({"title": title, "done": False})
        print("Task added ✅")
    else:
        print("⚠️ Empty task not added!")

def mark_done(tasks):
    show_tasks(tasks)
    try:
        index = int(input("Enter task number to mark done: ")) - 1
        if 0 <= index < len(tasks):
            tasks[index]["done"] = True
            print("Task marked as done ✔️")
        else:
            print("⚠️ Invalid task number!")
    except ValueError:
        print("⚠️ Please enter a number!")

def delete_task(tasks):
    show_tasks(tasks)
    try:
        index = int(input("Enter task number to delete: ")) - 1
        if 0 <= index < len(tasks):
            removed = tasks.pop(index)
            print(f"🗑️ Removed: {removed['title']}")
        else:
            print("⚠️ Invalid task number!")
    except ValueError:
        print("⚠️ Please enter a number!")

def main():
    tasks = load_tasks()

    while True:
        print("\n--- To-Do List Menu ---")
        print("1. View tasks")
        print("2. Add task")
        print("3. Mark task as done")
        print("4. Delete task")
        print("5. Exit")

        choice = input("Choose an option (1-5): ")

        if choice == "1":
            show_tasks(tasks)
        elif choice == "2":
            add_task(tasks)
        elif choice == "3":
            mark_done(tasks)
        elif choice == "4":
            delete_task(tasks)
        elif choice == "5":
            save_tasks(tasks)
            print("💾 Tasks saved. Goodbye!")
            break
        else:
            print("⚠️ Invalid choice! Try again.")

if __name__ == "__main__":
    main()
