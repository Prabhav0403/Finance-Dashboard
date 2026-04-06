# 📊 Finance Dashboard

🔗 Live Demo: https://finance-dashboard-teal-tau.vercel.app/  
---

## 🚀 Overview

A modern and responsive **Finance Dashboard** (frontend) built using **React and Vite**, designed to help users track transactions, visualize spending patterns, and gain actionable financial insights.

The application focuses on delivering a clean UI, smooth user experience, and interactive data visualization.

---

## ✨ Features

- 📈 Dashboard Overview with summary cards
- 📊 Time-based visualization (balance trends)
- 🧾 Category-based expense breakdown
- 💳 Transaction management (add / delete)
- 🔍 Advanced filtering and sorting
- 📤 Export transaction data
- ⚡ Mock API integration using custom hooks
- 🎨 Responsive UI with dark mode support
- ⏳ Loading skeletons and animations

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite)
- **State Management:** React Context API
- **Styling:** CSS
- **Data Handling:** Mock API + Local State

---

## 📁 Project Structure
```
src/
│
├── components/ # Reusable UI components
│ ├── dashboard/ # Dashboard-specific components
│ │ └── SummaryCards.jsx
│ │
│ ├── transactions/ # Transaction-related components
│ │ ├── TransactionTable.jsx
│ │ ├── TransactionFilters.jsx
│ │ ├── AddTransactionModal.jsx
│ │ └── ExportButton.jsx
│ │
│ └── ui/ # Generic UI components
│ ├── Navbar.jsx
│ └── Skeleton.jsx
│
├── context/ # Global state management
│ ├── AppContext.jsx # Context provider
│ └── useApp.jsx # Custom hook
│
├── hooks/ # Custom reusable hooks
│ ├── useMockApi.js
│ └── useAnimatedNumber.js
│
├── pages/ # Page-level components
│ └── Dashboard.jsx
│
├── utils/ # Utility/helper functions
│ └── calculations.js
│
├── data/ # Mock data
│ └── mockTransactions.js
│
├── App.jsx # Root component
├── main.jsx # Entry point
└── index.css # Global styles
```
---

## ⚙️ Installation & Setup

### 1. Clone the repository
git clone https://github.com/Prabhav0403/Finance-Dashboard.git
cd Finance-Dashboard

### 2. Install dependencies
npm install

### 3. Run development server
npm run dev

### 4. Build for production
npm run build

---

## 🌐 Deployment

Deployed using **Vercel** for fast and reliable hosting.

---

## 🧠 Technical Decisions

- Used **Vite** for faster development and optimized builds  
- Chose **Context API** for simple and maintainable state management  
- Implemented **custom hooks** for reusable logic (mock API, animations)  
- Designed modular components for scalability  

---

## ⚠️ Limitations

- Uses mock data (no real backend)
- No authentication system yet
- Limited data persistence

---

## 🔮 Future Improvements

- Backend integration (Node.js / Firebase)
- Authentication and role-based access
- Advanced analytics and insights
- Performance optimizations

---

## 👨‍💻 Author

**Prabhav**  
- LinkedIn: (https://www.linkedin.com/in/prabhav-srivastava-17a081241/)
---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
