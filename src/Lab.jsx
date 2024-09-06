/*Lab.js*/
import React, { useEffect, useState } from 'react';
import './Lab.css';

export default function Lab() {
    const [taskNumbers, setTaskNumbers] = useState([]);
    const [highPriorityQueue, setHighPriorityQueue] = useState([]);
    const [regularQueues, setRegularQueues] = useState([[], [], []]);
    const [queueNumber, setQueueNumber] = useState(4);
    const [currentTaskDurations, setCurrentTaskDurations] = useState([0, 0, 0, 0]);

    const generateTaskNumber = () => {
        const taskNumber = Math.floor(Math.random() * 100) + 1;
        const isRed = Math.random() < 0.3;
        const duration = taskNumber;

        const numberObject = {
            number: taskNumber,
            isRed: isRed,
            duration: duration,
        };

        setTaskNumbers((prevTaskNumbers) => {
            if (prevTaskNumbers) {
                return [...prevTaskNumbers, numberObject];
            } else {
                return [numberObject];
            }
        });
        setQueueNumber(queueNumber === 1 ? 4 : queueNumber - 1);
    };

    const admitTask = () => {
        if (taskNumbers.length === 0) {
            alert("No tasks to admit.");
            return;
        }

        const taskToAdmit = taskNumbers[0];

        if (taskToAdmit.isRed) {
            setHighPriorityQueue((prevHighPriorityQueue) => {
                if (prevHighPriorityQueue) {
                    return [...prevHighPriorityQueue, taskToAdmit];
                } else {
                    return [taskToAdmit];
                }
            });
            setCurrentTaskDurations((prevDurations) => {
                const updatedDurations = [...prevDurations];
                if (updatedDurations[3] === 0) {
                    updatedDurations[3] = taskToAdmit.duration;
                }
                return updatedDurations;
            });
        } else {
            let minQueueIndex = 0;
            let minQueueTotal = regularQueues[0].reduce((total, task) => total + task.number, 0);

            for (let i = 1; i < regularQueues.length; i++) {
                const queueTotal = regularQueues[i].reduce((total, task) => total + task.number, 0);
                if (queueTotal < minQueueTotal) {
                    minQueueIndex = i;
                    minQueueTotal = queueTotal;
                }
            }

            setRegularQueues((prevRegularQueues) => {
                const updatedQueues = [...prevRegularQueues];
                updatedQueues[minQueueIndex] = [
                    ...(updatedQueues[minQueueIndex] || []),
                    taskToAdmit,
                ];
                return updatedQueues;
            });

            setCurrentTaskDurations((prevDurations) => {
                const updatedDurations = [...prevDurations];
                if (updatedDurations[minQueueIndex] === 0) {
                    updatedDurations[minQueueIndex] = taskToAdmit.duration;
                }
                return updatedDurations;
            });
        }

        setTaskNumbers((prevTaskNumbers) => {
            if (prevTaskNumbers) {
                return prevTaskNumbers.slice(1);
            } else {
                return [];
            }
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setRegularQueues((prevRegularQueues) => {
                const updatedQueues = [...prevRegularQueues];
                for (let i = 0; i < updatedQueues.length; i++) {
                    const queue = updatedQueues[i];
                    if (queue && queue.length > 0) {
                        const firstTask = queue[0];
                        if (firstTask && firstTask.duration > 0) {
                            firstTask.duration -= 1;
                            setCurrentTaskDurations((prevDurations) => {
                                const updatedDurations = [...prevDurations];
                                updatedDurations[i] = firstTask.duration;
                                return updatedDurations;
                            });
                        } else {
                            queue.shift();
                            setCurrentTaskDurations((prevDurations) => {
                                const updatedDurations = [...prevDurations];
                                updatedDurations[i] = queue.length > 0 ? queue[0].duration : 0;
                                return updatedDurations;
                            });
                        }
                    }
                }
                return updatedQueues;
            });

            if (highPriorityQueue.length > 0) {
                if (highPriorityQueue[0] && highPriorityQueue[0].duration > 0) {
                    highPriorityQueue[0].duration -= 2;
                    setCurrentTaskDurations((prevDurations) => {
                        const updatedDurations = [...prevDurations];
                        updatedDurations[3] = highPriorityQueue[0].duration;
                        return updatedDurations;
                    });
                } else {
                    highPriorityQueue.shift();
                    setCurrentTaskDurations((prevDurations) => {
                        const updatedDurations = [...prevDurations];
                        updatedDurations[3] = highPriorityQueue.length > 0 ? highPriorityQueue[0].duration : 0;
                        return updatedDurations;
                    });
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [highPriorityQueue, regularQueues]);

    return (
        <div className='cell'>
            <div className='box'>
                <button onClick={generateTaskNumber} style={{ marginTop: '20px' }}>
                    Add Random Task
                </button>
                <h2>Task Queue</h2>
                {taskNumbers.map((item, index) => (
                    <p
                        key={index}
                        style={{
                            border: '1px solid #000',
                            display: 'inline-block',
                            margin: '2px',
                            padding: '2px',
                            color: item.isRed ? 'red' : 'inherit',
                        }}
                    >
                        {item.number}
                    </p>
                ))}
                <p></p>
                <button onClick={admitTask}>Admit Task</button>
            </div>

            <div className='r-boxes'>
                <div className='r-box-high'>
                    <b>High Priority Queue 1</b>
                    <br />
                    <p>Queue List:</p>
                    {highPriorityQueue
                        .filter((item) => item && item.duration > 0)
                        .map((item, index) => (
                            <p
                                key={index}
                                style={{
                                    border: '1px solid #FF0000',
                                    display: 'inline-block',
                                    margin: '2px',
                                    padding: '2px',
                                }}
                            >
                                {item.number}
                            </p>
                        ))}
                    <p>Duration:</p>
                    {currentTaskDurations[3] > 0 && (
                        <div
                            className='duration-bar'
                            style={{
                                width: `${(currentTaskDurations[3] / highPriorityQueue[0].number) * 100}%`,
                            }}
                        />
                    )}
                </div>

                {regularQueues.map((regularQueue, index) => (
                    <div className='r-box' key={index}>
                        <b>Regular Queue {index + 2}</b>
                        <br />
                        <p>Queue List:</p>
                        {regularQueue
                            .filter((item) => item && item.duration > 0)
                            .map((item, index) => (
                                <p
                                    key={index}
                                    style={{
                                        border: '1px solid #000',
                                        display: 'inline-block',
                                        margin: '2px',
                                        padding: '2px',
                                    }}
                                >
                                    {item.number}
                                </p>
                            ))}
                        <p>Duration:</p>
                        {currentTaskDurations[index] > 0 && (
                            <div
                                className='duration-bar'
                                style={{
                                  width: `${(currentTaskDurations[index] / regularQueue[0].number) * 100}%`,
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
