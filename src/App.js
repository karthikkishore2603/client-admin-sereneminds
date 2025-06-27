import React from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./components/Topbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Reports from "./pages/Reports.jsx";
import Graph from "./pages/Graph.jsx";
import City from "./pages/MasterData/City.jsx";
import State from "./pages/MasterData/State.jsx";
import Country from "./pages/MasterData/Country.jsx";
import Institute from "./pages/MasterData/Institute.jsx";
import Createinstitute from "./pages/MasterData/Createinstitute.jsx";
import Branch from "./pages/MasterData/Branch.jsx";
import CreateBranch from "./pages/MasterData/CreateBranch.jsx";
import EditBranch from "./pages/MasterData/EditBranch.jsx";
import InstituteOverview from "./pages/MasterData/InstituteOverview.jsx";
import BranchOverview from "./pages/MasterData/BranchOverview.jsx";
import School from "./pages/MasterData/School.jsx";
import SchoolOverview from "./pages/MasterData/SchoolOverview.jsx";
import SchoolCreate from "./pages/MasterData/SchoolCreate.jsx";
import SchoolEdit from "./pages/MasterData/SchoolEdit.jsx";
import Board from "./pages/MasterData/Board.jsx";
import BoardOverview from "./pages/MasterData/BoardOverview.jsx";
import BoardCreate from "./pages/MasterData/BoardCreate.jsx";
import BoardEdit from "./pages/MasterData/BoardEdit.jsx";
import ClassPage from "./pages/MasterData/Class.jsx";
import ClassOverview from "./pages/MasterData/ClassOverview.jsx";
import ClassCreate from "./pages/MasterData/ClassCreate.jsx";
import ClassEdit from "./pages/MasterData/ClassEdit.jsx";
import Division from "./pages/MasterData/Division";
import DivisionOverview from "./pages/MasterData/DivisionOverview";
import DivisionCreate from "./pages/MasterData/DivisionCreate";
import DivisionEdit from "./pages/MasterData/DivisionEdit";
import Academicyear from "./pages/MasterData/Academicyear";
import Emotion from "./pages/MasterData/Emotion";
import Zone from "./pages/MasterData/Zone";
import Category from "./pages/MasterData/Category";
import SubCategory from "./pages/MasterData/SubCategory";
import Impact from "./pages/MasterData/Impact";
import Pleasantness from "./pages/MasterData/Pleasantness";
import InstituteEdit from "./pages/MasterData/InstituteEdit";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/master/city" element={<City />} />
          <Route path="/master/state" element={<State />} />
          <Route path="master/country" element={<Country />} />
          <Route path="master/institute" element={<Institute />} />
          <Route path="/institute/create" element={<Createinstitute />} />
          <Route path="master/branch" element={<Branch />} />
          <Route path="/branch/create" element={<CreateBranch />} />
          <Route path="/branch/edit/:id" element={<EditBranch />} />
          <Route
            path="/institute/overview/:id"
            element={<InstituteOverview />}
          />
          <Route path="/branch/overview/:id" element={<BranchOverview />} />
          <Route path="/master/school" element={<School />} />
          <Route path="/school/overview/:id" element={<SchoolOverview />} />
          <Route path="/school/create" element={<SchoolCreate />} />
          <Route path="/school/edit/:id" element={<SchoolEdit />} />
          <Route path="/master/board" element={<Board />} />
          <Route path="/board/overview/:id" element={<BoardOverview />} />
          <Route path="/board/create" element={<BoardCreate />} />
          <Route path="/board/edit/:id" element={<BoardEdit />} />
          <Route path="/master/class" element={<ClassPage />} />
          <Route path="/class/overview/:id" element={<ClassOverview />} />
          <Route path="/class/create" element={<ClassCreate />} />
          <Route path="/class/edit/:id" element={<ClassEdit />} />
          <Route path="/master/division" element={<Division />} />
          <Route path="/division/overview/:id" element={<DivisionOverview />} />
          <Route path="/division/create" element={<DivisionCreate />} />
          <Route path="/division/edit/:id" element={<DivisionEdit />} />
          <Route path="/master/academicyear" element={<Academicyear />} />
          <Route path="/master/emotion" element={<Emotion />} />
          <Route path="/master/zone" element={<Zone />} />
          <Route path="/master/category" element={<Category />} />
          <Route path="/master/subcategory" element={<SubCategory />} />
          <Route path="/master/impact" element={<Impact />} />
          <Route path="/master/pleasantness" element={<Pleasantness />} />
          <Route path="/institute/edit/:id" element={<InstituteEdit />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
