import React, { useState } from 'react'
import questions from './data/questions.json'

export default function App() {
	const [answers, setAnswers] = useState({})
	const [submitted, setSubmitted] = useState(false)

	const handleChange = (id, value) => {
		setAnswers({ ...answers, [id]: parseInt(value) })
	}

	const handleSubmit = () => {
		setSubmitted(true)
	}

	const results = () => {
		const scores = {}
		for (let q of questions) {
			const val = answers[q.id] || 0
			scores[q.gift] = (scores[q.gift] || 0) + val
		}
		return Object.entries(scores)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
	}

	return (
		<div className='max-w-3xl mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Spiritual Gifts Test</h1>
			{!submitted ? (
				<div>
					{questions.map(q => (
						<div key={q.id} className='mb-3'>
							<label className='block mb-1'>{q.id}. {q.text}</label>
							<select
								className='border p-1'
								value={answers[q.id] || ''}
								onChange={e => handleChange(q.id, e.target.value)}
							>
								<option value=''>Select</option>
								<option value='0'>0 – Not at all</option>
								<option value='1'>1 – Occasionally</option>
								<option value='2'>2 – Sometimes</option>
								<option value='3'>3 – Usually</option>
								<option value='4'>4 – Highly</option>
							</select>
						</div>
					))}
					<button
						className='mt-4 px-4 py-2 bg-blue-600 text-white rounded'
						onClick={handleSubmit}
					>
						Submit
					</button>
				</div>
			) : (
				<div>
					<h2 className='text-xl font-semibold mb-2'>Top 3 Gifts</h2>
					<ul className='list-disc ml-6'>
						{results().map(([gift, score], i) => (
							<li key={i}>{gift}: {score} points</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
