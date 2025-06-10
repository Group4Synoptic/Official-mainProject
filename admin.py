import tkinter as tk
from tkinter import ttk, messagebox
import requests

SERVER_URL = "http://localhost:1942" 

class AdminApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Admin Requests")
        self.geometry("1400x400")
        self.requests = []
        self.create_widgets()
        self.refresh_requests()

    def create_widgets(self):
        columns = ("id", "user_id", "litres", "urgency", "reservoir_id", "contact_info", "completed")
        self.tree = ttk.Treeview(self, columns=columns, show="headings")
        for col in columns:
            self.tree.heading(col, text=col)
        self.tree.pack(fill=tk.BOTH, expand=True)

        btn_frame = tk.Frame(self)
        btn_frame.pack(fill=tk.X)
        self.accept_btn = tk.Button(btn_frame, text="Accept Selected Request", command=self.accept_request)
        self.accept_btn.pack(side=tk.LEFT, padx=10, pady=5)
        self.refresh_btn = tk.Button(btn_frame, text="Refresh", command=self.refresh_requests)
        self.refresh_btn.pack(side=tk.LEFT, padx=10, pady=5)

    def refresh_requests(self):
        try:
            resp = requests.get(f"{SERVER_URL}/api/admin/requests")
            self.requests = resp.json()
            self.tree.delete(*self.tree.get_children())
            for req in self.requests:
                self.tree.insert("", tk.END, values=(
                    req["id"], req["user_id"], req["litres"], req["urgency"],
                    req["reservoir_id"], req["contact_info"], "Yes" if req["request_completed"] else "No"
                ))
        except Exception as e:
            messagebox.showerror("Error", f"Failed to fetch requests:\n{e}")

    def accept_request(self):
        selected = self.tree.selection()
        if not selected:
            messagebox.showinfo("Select", "Please select a request to accept.")
            return
        item = self.tree.item(selected[0])
        req_id, user_id, litres, urgency, reservoir_id, contact_info, completed = item["values"]
        if completed == "Yes":
            messagebox.showinfo("Already Completed", "This request is already completed.")
            return
        try:
            resp = requests.post(
                f"{SERVER_URL}/api/admin/accept-request",
                json={"id": req_id, "reservoir_id": reservoir_id, "litres": litres}
            )
            data = resp.json()
            if data.get("success"):
                messagebox.showinfo("Success", "Request accepted and reservoir updated.")
                self.refresh_requests()
            else:
                messagebox.showerror("Error", f"Failed to accept request:\n{data}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to accept request:\n{e}")

if __name__ == "__main__":
    app = AdminApp()
    app.mainloop()