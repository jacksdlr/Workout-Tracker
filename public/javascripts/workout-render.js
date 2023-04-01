const xhttp = new XMLHttpRequest()

const form = document.getElementById("exercise-form")
const workoutContainer = document.querySelector(".workout-exercises")
const workoutTitle = document.getElementById("workout-name")
const displayDate = document.getElementById("display-date")

// Context menus
const exerciseMenu = document.getElementById("exercise-menu")
const exerciseCommentsMenu = document.getElementById("exercise-comments-menu")
const weightMenu = document.getElementById("weight-menu")
const setMenu = document.getElementById("set-menu")
const supersetMenu = document.getElementById("superset-menu")
const supersetRepsMenu = document.getElementById("superset-reps-menu")
const setCommentsMenu = document.getElementById("set-comments-menu")

// If the date input for the form is empty (on page load) it defaults to current date
if (inputDate.value == "") {
    inputDate.value = new Date().toISOString().split("T")[0]
}

const submitRequest = (date, reset) => {
    xhttp.open("GET", "/workouts/" + date)
    xhttp.send()
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            if (this.response) {
                if (this.response.match(/^</)) {
                    renderWorkout("not found", false, date)
                } else {
                    renderWorkout(JSON.parse(this.response), false, date)
                }
            } else {
                renderWorkout("not found", false, date)
            }
        }
    }
}

form.addEventListener("submit", (e) => {
    // Submitting the form prevents default action of POSTing data and reloading page with response
    e.preventDefault()
    xhttp.open("POST", "/workouts")
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
    // Converts form inputs into a JSON object that is POSTed to the workouts route
    xhttp.send(JSON.stringify({
        date: inputDate.value,
        exercise_name: inputExercise.value,
        exercise_comment: inputExerciseComment.value,
        set_weight: inputWeight.value,
        set_weight_unit: inputWeightUnit.value,
        set_reps: inputReps.value,
        set_comment: inputSetComment.value,
        superset: supersetCheckbox.value,
        superset_exercise: inputSupersetExercise.value,
        superset_weight: inputSupersetWeight.value,
        superset_weight_unit: inputSupersetWeightUnit.value,
        superset_reps: inputSupersetReps.value
    }))
    // Clear comment inputs
    inputExerciseComment.value = ""
    inputSetComment.value = ""
    // When ready state reaches 4 (request is complete and response data has been returned), the workout renders
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            renderWorkout(JSON.parse(this.response), false, inputDate.value)
        }
    }
})

displayDate.addEventListener("change", (e) => {
    // Get the date and submit a GET request to return the user's workout for that date
    if (workoutTitle.textContent !== "Workout for:Example date") {
        xhttp.open("GET", "/workouts/" + displayDate.value)
        xhttp.send()
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                if (this.response) {
                    if (this.response.match(/^</)) {
                        renderWorkout("not found", false, displayDate.value)
                    } else {
                        renderWorkout(JSON.parse(this.response), true, displayDate.value)
                    }
                } else {
                    renderWorkout("not found", false, displayDate.value)
                }
            }
        }
    } else {
        alert("You need to be logged in to see your workouts.")
    }
})

const renderWorkout = (data, reset, date) => {
    let notFound = document.getElementById("not-found")
    let dateToRemove = document.getElementById("date")
    if (date == "example") {
        workoutTitle.insertAdjacentHTML("beforeend", `<p id="date">Example date</p>`)
    }
    // change this to just remove all children??
    if (notFound) {
        notFound.remove()
    }
    if (dateToRemove) {
        dateToRemove.remove()
    }
    if (data == "not found") {
        notFound = document.createElement("p")
        notFound.setAttribute("id", "not-found")
        notFound.textContent = "No workout exists for this date..."
        workoutContainer.appendChild(notFound)
        const existingContainers = workoutContainer.querySelectorAll(".exercise-container")
        existingContainers.forEach(container => container.remove())
        workoutContainer.appendChild(notFound)
        displayDate.value = date
        workoutTitle.insertAdjacentHTML("beforeend", `<p id="date">${new Date(date).toDateString().slice(0, -5)}</p>`)
        return
    }
    let existingContainers = workoutContainer.querySelectorAll(".exercise-container")
    if (data.date != displayDate.value || reset == true) {
        existingContainers.forEach(container => container.remove())
    } else if (existingContainers.length > data.exercises.length) {
        existingContainers.forEach(container => {
            let exists = false
            data.exercises.forEach(exercise => {
                if (container.id == `J${exercise._id}`) {
                    return exists = true
                }
            })
            if (exists == false) {
                container.remove()
            }
        })
        //existingContainers.forEach(container => container.remove())
    }
    if (date != "example") {
        workoutTitle.insertAdjacentHTML("beforeend", `<p id="date">${new Date(date).toDateString().slice(0, -5)}</p>`)
        displayDate.value = date
    }
    data.exercises.forEach(exercise => {
        createExerciseContainer(exercise)
        createWeightContainers(exercise)
    })
    $(".set-weight-and-count").off()
    $(".set-weight-and-count").click(function () {
        $header = $(this)
        $content = $header.next()
        $content.slideToggle(500)
    })
    $(".superset-exercise-and-weight").off()
    $(".superset-exercise-and-weight").click(function () {
        $header = $(this)
        $content = $header.next()
        $content.slideToggle(500)
    })
    mobileRender(true)
}

const createExerciseContainer = (exercise) => {
    let exerciseContainer = document.getElementById(`J${exercise._id}`)
    if (!exerciseContainer) {
        exerciseContainer = document.createElement("div")
        exerciseContainer.classList.add("exercise-container")
        exerciseContainer.setAttribute("id", `J${exercise._id}`)
        workoutContainer.appendChild(exerciseContainer)
    }

    let exerciseName = document.getElementById(`J${exercise._id}-name`)
    if (!exerciseName) {
        exerciseName = document.createElement("h2")
        exerciseName.classList.add("exercise-name")
        exerciseName.setAttribute("id", `J${exercise._id}-name`)
        exerciseName.insertAdjacentText("afterbegin", exercise.exercise_name)
        exerciseContainer.appendChild(exerciseName)
        exerciseName.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            hideAllMenus()

            // Position custom context menu at cursor
            $("#exercise-menu").slideDown(200).offset({
                top: e.pageY,
                left: preventOutOfBounds(exerciseMenu, e.pageX)
            })

            // Custom right click menu to edit or delete exercise
            editExerciseName($(`#J${exercise._id}-name`)[0].textContent, displayDate.value)
            addExerciseComment($(`#J${exercise._id}-name`)[0].textContent, displayDate.value)
            deleteExercise($(`#J${exercise._id}-name`)[0].textContent, displayDate.value)
        })
    } else if (exerciseName.textContent != exercise.exercise_name) {
        exerciseName.textContent = exercise.exercise_name
        // For some reason the exercise name chevron disappears, so if renaming it needs to be added back, with rotation depending on if it was collapsed or not
        if (!$(exerciseName).nextAll().is(":visible")) {
            exerciseContainer.firstChild.insertAdjacentHTML("beforeend", "<i class='fa-solid fa-chevron-down exercise-collapse' style='transform: rotate(-90deg);'></i>")
        } else {
            exerciseContainer.firstChild.insertAdjacentHTML("beforeend", "<i class='fa-solid fa-chevron-down exercise-collapse'></i>")
        }
    }
    let exerciseComments = document.getElementById(`J${exercise._id}-comments`)

    if (exerciseComments) {
        let exerciseComment = exerciseComments.querySelectorAll("li")
        if (exerciseComment.length > exercise.comments.length) {
            exerciseComment.forEach(comment => {
                let exists = false
                exercise.comments.forEach(exercise => {
                    if (comment.textContent == exercise) {
                        return exists = true
                    }
                })
                if (exists == false && exerciseComment.length == 1) {
                    exerciseComments.remove()
                } else if (exists == false) {
                    comment.remove()
                }
            })
        }
    }

    if (exercise.comments != "") {
        if (!exerciseComments) {
            exerciseComments = document.createElement("div")
            exerciseComments.classList.add("exercise-comments")
            exerciseComments.setAttribute("id", `J${exercise._id}` + "-comments")
            exerciseComments.setAttribute("style", "display: flex; flex-direction: column;")
            document.getElementById(`J${exercise._id}` + "-name").insertAdjacentElement("afterend", exerciseComments)
        }

        exercise.comments.forEach((comment, index) => {
            let exerciseComment = exerciseComments.querySelectorAll("li")
            if (!exerciseComment[index]) {
                exerciseComment = document.createElement("li")
                exerciseComment.textContent = comment
                exerciseComments.appendChild(exerciseComment)
                exerciseComment.addEventListener("contextmenu", function contextMenu(e) {
                    e.preventDefault()
                    hideAllMenus()

                    $("#exercise-comments-menu").slideDown(200).offset({
                        top: e.pageY,
                        left: preventOutOfBounds(exerciseCommentsMenu, e.pageX)
                    })

                    editExerciseComment($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, index, exerciseComment.textContent)
                    deleteExerciseComment($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, index)
                })
                setTimeout(() => {
                    toggleVisibility(exercise._id)
                }, 1);
            } else if (exerciseComment[index].textContent != comment) {
                exerciseComment[index].textContent = comment
            }
        })
    }
}

const createWeightContainers = (exercise) => {
    exerciseContainer = document.getElementById(`J${exercise._id}`)
    if (exercise.sets.length < exerciseContainer.querySelectorAll(".weight-container").length) {
        exerciseContainer.querySelectorAll(".weight-container").forEach(container => container.remove())
    }
    exercise.sets.forEach(set => {
        let weightContainer = document.getElementById(`J${set._id}`)
        if (!weightContainer) {
            weightContainer = document.createElement("div")
            weightContainer.classList.add("weight-container")
            weightContainer.setAttribute("id", `J${set._id}`)
            weightContainer.setAttribute("style", "display: flex; flex-direction: column;")
            exerciseContainer.appendChild(weightContainer)
            setTimeout(() => {
                toggleVisibility(exercise._id)
            }, 1);
        }
        populateWeightContainers(exercise, set, weightContainer)
    })
}

const populateWeightContainers = (exercise, set, weightContainer) => {
    let setWeightAndCount = weightContainer.querySelector(".set-weight-and-count")
    // Create the element that holds that set data if not found
    if (!setWeightAndCount) {
        setWeightAndCount = document.createElement("div")
        setWeightAndCount.classList.add("set-weight-and-count")
        weightContainer.appendChild(setWeightAndCount)
    }

    // Descructure all possible set variables
    let {
        set_weight,
        set_reps,
        superset_exercise,
        superset_weight,
        superset_reps,
        sets_count,
        _id
    } = set

    if (!set_weight) {
        set_weight = ""
    }

    let setWeight = setWeightAndCount.querySelector(".set-weight")
    if (!setWeight) {
        setWeight = document.createElement("h3")
        setWeight.classList.add("set-weight")
        setWeight.textContent = set_weight
        setWeightAndCount.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            hideAllMenus()

            $("#weight-menu").slideDown(200).offset({
                top: e.pageY,
                left: preventOutOfBounds(weightMenu, e.pageX)
            })

            editWeight($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, _id, setWeight.textContent)
            deleteWeight($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, _id)
        })
        setWeightAndCount.appendChild(setWeight)
    } else if (setWeight.textContent != set_weight) {
        setWeight.textContent = set_weight
    }

    let setCount = setWeightAndCount.querySelector(".set-count")

    if (!setCount) {
        setCount = document.createElement("h3")
        setCount.classList.add("set-count")

        // Get the sets count so that grammar is correct when displaying set data
        if (sets_count == 1) {
            setCount.textContent = "1 set"
        } else if (sets_count > 1) {
            setCount.textContent = `${sets_count} sets`
        }
        setWeightAndCount.appendChild(setCount)
    } else if (setCount.textContent.split(" ")[0] != sets_count) {
        if (sets_count == 1) {
            setCount.textContent = "1 set"
        } else if (sets_count > 1) {
            setCount.textContent = `${sets_count} sets`
        }
    }

    let setDetails = weightContainer.querySelector(".set-details")
    if (!setDetails) {
        setDetails = document.createElement("div")
        setDetails.classList.add("set-details")
        weightContainer.appendChild(setDetails)
    }

    let setReps = setDetails.querySelector(".set-reps")
    if (!setReps) {
        setReps = document.createElement("p")
        setReps.classList.add("set-reps")
        setReps.textContent = `Reps: `
        setDetails.appendChild(setReps)
    } else if (set_reps.length < setReps.querySelectorAll(".set-rep").length) {
        setReps.querySelectorAll(".set-rep").forEach(set => set.remove())
        setReps.textContent = `Reps: `
    }

    set_reps.forEach((reps, index) => {
        let setRep = setReps.querySelectorAll(".set-rep")
        if (!setRep[index]) {
            if (setReps.textContent.slice(-1) != "," && index != 0) {
                setReps.insertAdjacentText("beforeend", ",")
            }
            setRep = document.createElement("p")
            setRep.classList.add("set-rep")
            setRep.textContent = reps
            setReps.append(setRep)
            if (index != set_reps.length - 1) {
                setReps.insertAdjacentText("beforeend", ",")
            }
            setRep.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                hideAllMenus()

                $("#set-menu").slideDown(200).offset({
                    top: e.pageY,
                    left: preventOutOfBounds(setMenu, e.pageX)
                })

                comments = []
                setDetails.querySelectorAll("li").forEach(item => comments.push(item.textContent))

                editReps($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, _id, index, setRep.textContent)
                addSetComment($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, _id, index)
                deleteReps($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, comments, _id, index)
            })
            setTimeout(() => {
                toggleVisibility(exercise._id)
            }, 1);
        } else if (setRep[index].textContent != reps) {
            setRep[index].textContent = reps
        }
    })

    if (superset_exercise) {
        let supersetText = setDetails.querySelector("#superset-text")
        if (!supersetText) {
            supersetText = document.createElement("p")
            supersetText.setAttribute("id", "superset-text")
            supersetText.textContent = "~ Superset with ~"
            setDetails.appendChild(supersetText)
        }

        let supersetExerciseAndWeight = setDetails.querySelector(".superset-exercise-and-weight")
        if (!supersetExerciseAndWeight) {
            supersetExerciseAndWeight = document.createElement("div")
            supersetExerciseAndWeight.classList.add("superset-exercise-and-weight")
            supersetExerciseAndWeight.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                hideAllMenus()

                $("#superset-menu").slideDown(200).offset({
                    top: e.pageY,
                    left: preventOutOfBounds(supersetMenu, e.pageX)
                })

                editSupersetExercise($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, _id, supersetExercise.textContent)
                editSupersetWeight($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, _id, supersetWeight.textContent)
                deleteSuperset($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, _id)
            })
            setDetails.appendChild(supersetExerciseAndWeight)
        }

        let supersetExercise = supersetExerciseAndWeight.querySelector(".superset-exercise")
        if (!supersetExercise) {
            supersetExercise = document.createElement("h4")
            supersetExercise.classList.add("superset-exercise")
            supersetExercise.textContent = superset_exercise
            supersetExerciseAndWeight.appendChild(supersetExercise)
        } else if (supersetExercise.textContent != superset_exercise) {
            supersetExercise.textContent = superset_exercise
        }

        let supersetWeight = supersetExerciseAndWeight.querySelector(".superset-weight")
        if (!supersetWeight) {
            supersetWeight = document.createElement("h4")
            supersetWeight.classList.add("superset-weight")
            supersetWeight.textContent = superset_weight
            supersetExerciseAndWeight.appendChild(supersetWeight)
        } else if (supersetWeight.textContent != superset_weight) {
            supersetWeight.textContent = superset_weight
        }

        let supersetDetails = setDetails.querySelector(".superset-details")
        if (!supersetDetails) {
            supersetDetails = document.createElement("div")
            supersetDetails.classList.add("superset-details")
            setDetails.appendChild(supersetDetails)
        }

        let supersetReps = supersetDetails.querySelector(".superset-reps")
        if (!supersetReps) {
            supersetReps = document.createElement("p")
            supersetReps.classList.add("superset-reps")
            supersetReps.textContent = `Reps: `
            supersetDetails.appendChild(supersetReps)
        } else if (superset_reps.length < supersetReps.querySelectorAll(".superset-rep").length) {
            supersetReps.querySelectorAll(".superset-rep").forEach(set => set.remove())
            supersetReps.textContent = `Reps: `
        }

        superset_reps.forEach((reps, index) => {
            let supersetRep = supersetReps.querySelectorAll(".superset-rep")
            if (!supersetRep[index]) {
                if (supersetReps.textContent.slice(-1) != "," && index != 0) {
                    supersetReps.insertAdjacentText("beforeend", ",")
                }
                supersetRep = document.createElement("p")
                supersetRep.classList.add("superset-rep")
                supersetRep.textContent = reps
                supersetReps.append(supersetRep)
                if (index != superset_reps.length - 1) {
                    supersetReps.insertAdjacentText("beforeend", ",")
                }
                supersetRep.addEventListener("contextmenu", (e) => {
                    e.preventDefault()
                    hideAllMenus()

                    $("#superset-reps-menu").slideDown(200).offset({
                        top: e.pageY,
                        left: preventOutOfBounds(supersetRepsMenu, e.pageX)
                    })

                    editSupersetReps($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, _id, index, supersetRep.textContent)
                })
            } else if (supersetRep[index].textContent != reps) {
                supersetRep[index].textContent = reps
            }
        })
    } else if (setDetails.querySelector(".superset-exercise-and-weight")) {
        setDetails.querySelector(".superset-exercise-and-weight").remove()
        setDetails.querySelector("#superset-text").remove()
        setDetails.querySelector(".superset-details").remove()
    }

    let setComments = setDetails.querySelector(".set-comments")
    if (setComments) {
        let setComment = setComments.querySelectorAll("li")
        if (setComment.length > set.comments.length) {
            setComment.forEach(comment => {
                let exists = false
                set.comments.forEach(set => {
                    if (comment.textContent == set) {
                        return exists = true
                    }
                })
                if (exists == false && setComment.length == 1) {
                    setComments.remove()
                } else if (exists == false) {
                    comment.remove()
                }
            })
        }
    }

    if (set.comments != "") {
        if (!setComments) {
            setComments = document.createElement("ul")
            setComments.classList.add("set-comments")
            setDetails.appendChild(setComments)
        }
        set.comments.forEach((comment, index) => {
            let setComment = setComments.querySelectorAll("li")
            if (!setComment[index]) {
                setComment = document.createElement("li")
                setComment.textContent = comment
                setComments.appendChild(setComment)
                setComment.addEventListener("contextmenu", (e) => {
                    e.preventDefault()
                    hideAllMenus()

                    $("#set-comments-menu").slideDown(200).offset({
                        top: e.pageY,
                        left: preventOutOfBounds(setCommentsMenu, e.pageX)
                    })

                    editSetComment($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, _id, index, setComment.textContent)
                    deleteSetComment($(`#J${exercise._id}-name`)[0].textContent, displayDate.value, _id, index)
                })
            } else if (setComment[index].textContent != comment) {
                setComment[index].textContent = comment
            }
        })
    }
}
const mobileRender = (real) => {
    if ($(window).width() < $(window).height()) {
        $(".exercise-name").off()
        $(".exercise-name").click(function () {
            $header = $(this)
            $content = $header.nextAll()
            $chevron = $header.children(".exercise-collapse")
            if (!$content.is(":visible")) {
                $({ deg: -90 }).animate({ deg: 0 }, {
                    duration: 500,
                    step: (now) => {
                        $chevron.css({
                            transform: "rotate(" + now + "deg)"
                        })
                    }
                })
            } else {
                $({ deg: 0 }).animate({ deg: -90 }, {
                    duration: 500,
                    step: (now) => {
                        $chevron.css({
                            transform: "rotate(" + now + "deg)"
                        })
                    }
                })
            }
            $content.slideToggle(500)
        })
        let exerciseContainers = document.querySelectorAll(".exercise-container")

        exerciseContainers.forEach(container => {
            if (real == true && container.firstChild.children.length == 0) {
                let existingCollapsers = container.querySelectorAll(".exercise-collapse")
                existingCollapsers.forEach(item => item.remove())

                container.firstChild.insertAdjacentHTML("beforeend", "<i class='fa-solid fa-chevron-down exercise-collapse'></i>")
            }
        })
    } else {
        let exerciseCollapsers = document.querySelectorAll(".exercise-collapse")
        exerciseCollapsers.forEach(item => item.remove())
        $(".exercise-name").off("click")
        $(".exercise-name").nextAll().slideDown(0)
    }
}

window.onresize = () => {
    mobileRender()
}

const falseSubmit = document.getElementById("submit-button-false")
if (falseSubmit) {
    falseSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        alert("Please log in to save your workout.")
    })
    submitRequest("example")
} else {
    submitRequest(inputDate.value)
}

const toggleVisibility = (id) => {
    $header = $(`#J${id}-name`)
    $content = $header.nextAll()
    $chevron = $header.children(".exercise-collapse")
    if ($chevron[0].style.transform == "rotate(-90deg)") {
        $({ deg: -90 }).animate({ deg: 0 }, {
            duration: 500,
            step: (now) => {
                $chevron.css({
                    transform: "rotate(" + now + "deg)"
                })
            }
        })
    }
    $content.slideDown(500)
}