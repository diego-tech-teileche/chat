import io from "socket.io-client"
import { useEffect, useState } from "react"

const socket = io("http://localhost:3000")

const App = () => {
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState([])

	const handleSubmit = (e) => {
		e.preventDefault()

		const newMessage = {
			body: message,
			from: "Me",
		}

		setMessages([...messages, newMessage])
		socket.emit("message", message)
	}

	useEffect(() => {
		socket.on("message", receiveMessage)

		return () => socket.off("message", receiveMessage)
	}, [])

	const receiveMessage = (message) =>
		setMessages((state) => [...state, message])

	return (
		<div className="flex h-screen items-center justify-center bg-zinc-800 text-white">
			<form onSubmit={handleSubmit} className="bg-zinc-900 p-10 rounded-md">
				<h1 className="text-2xl font-bold my-2">Chat Socket</h1>
				<input
					type="text"
					placeholder="Write a message..."
					onChange={(e) => setMessage(e.target.value)}
					className="border-2 border-zinc-500 bg-zinc-400 text-black p-2 w-full rounded-md placeholder:text-gray-700"
				/>

				<ul>
					{messages.map((message, i) => (
						<li
							key={i}
							className={`my-2 p-2 table rounded-md ${
								message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-sky-500"
							}`}
						>
							<b className="block">{message.from}</b>
							<span className="text-md">{message.body}</span>
						</li>
					))}
				</ul>
			</form>
		</div>
	)
}

export default App
