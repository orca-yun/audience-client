import { HashRouter as HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./views/Index";
import NotFound from "./views/NotFound"
import LoginSucceeded from "./views/LoginSucceeded"
import VConsole from "vconsole"

function App() {
	// new VConsole()
	return (
		<div className="App">
			<HashRouter>
				<Routes>
					<Route path="/home" element={<Index/>}/>
					<Route path="/success" element={<LoginSucceeded/>}/>
					<Route path="/" element={<Navigate to="/home" replace/>}/>
					<Route path="*" element={<NotFound/>}></Route>
				</Routes>
			</HashRouter>
		</div>
	)
}

export default App
