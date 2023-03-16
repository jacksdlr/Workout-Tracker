const inputDate = document.getElementById("workout-input")
const inputExercise = document.getElementById("exercise-input")
const inputWeight = document.getElementById("weight-input")
const inputWeightUnit = document.getElementById("weight-unit")
const inputWeightKg = document.getElementById("weight-kg")
const inputWeightLbs = document.getElementById("weight-lbs")
const inputReps = document.getElementById("reps-input")
const supersetCheckbox = document.getElementById("superset-input")
const inputSupersetExercise = document.getElementById("superset-exercise-input")
const inputSupersetWeight = document.getElementById("superset-weight-input")
const inputSupersetWeightUnit = document.getElementById("superset-weight-unit")
const inputSupersetWeightKg = document.getElementById("superset-weight-kg")
const inputSupersetWeightLbs = document.getElementById("superset-weight-lbs")
const inputSupersetReps = document.getElementById("superset-reps-input")

const clearButton = document.getElementById("clear-form")
clearButton.addEventListener("click", () => {
    form.reset()
})

const toggleVisibility = () => {
    const supersetInputContainers = document.querySelectorAll(".superset-input-container")
    const supersetExercise = document.getElementById("superset-exercise-input")
    // If superset is selected, the respective inputs are marked as visible and the exercise name is now required
    if (supersetCheckbox.checked) {
        supersetInputContainers.forEach((container) => {
            container.style.visibility = "visible"
            container.style.display = "flex"
        })
        supersetExercise.setAttribute("required", "true")
        // If it is unselected it resets the inputs to again be hidden, and exercise name is no longer required to submit the form
    } else {
        supersetInputContainers.forEach((container) => {
            container.style.visibility = "hidden"
            container.style.display = "none"
        })
        supersetExercise.removeAttribute("required")
    }
}

const populate = () => {
    inputDate.value = sessionStorage.getItem("date")
    if (inputDate.value == "") {
        inputDate.value = new Date().toISOString().split("T")[0]
    }
    inputExercise.value = sessionStorage.getItem("exercise_name")
    inputWeight.value = sessionStorage.getItem("set_weight")
    if (sessionStorage.getItem("set_weight_unit") == "kg") {
        inputWeightKg.setAttribute("selected", "selected")
        inputWeightLbs.removeAttribute("selected")
    } else if (sessionStorage.getItem("set_weight_unit") == "lbs") {
        inputWeightKg.removeAttribute("selected")
        inputWeightLbs.setAttribute("selected", "selected")
    }
    inputReps.value = sessionStorage.getItem("set_reps")
    if (sessionStorage.getItem("superset") == "true") {
        supersetCheckbox.checked = "on"
    } else {
        supersetCheckbox.removeAttribute("checked")
        sessionStorage.setItem("superset_exercise", "")
        sessionStorage.setItem("superset_weight", "")
        sessionStorage.setItem("superset_weight_unit", "kg")
        sessionStorage.setItem("superset_reps", "")
    }
    inputSupersetExercise.value = sessionStorage.getItem("superset_exercise")
    inputSupersetWeight.value = sessionStorage.getItem("superset_weight")
    if (sessionStorage.getItem("superset_weight_unit") == "kg") {
        inputSupersetWeightKg.setAttribute("selected", "selected")
        inputSupersetWeightLbs.removeAttribute("selected")
    } else {
        inputSupersetWeightKg.removeAttribute("selected")
        inputSupersetWeightLbs.setAttribute("selected", "selected")
    }
    inputSupersetReps.value = sessionStorage.getItem("superset_reps")

    toggleVisibility()
}

populate()

inputDate.addEventListener("change", () => {
    sessionStorage.setItem("date", inputDate.value)
})
inputExercise.addEventListener("change", () => {
    sessionStorage.setItem("exercise_name", inputExercise.value)
})
inputWeight.addEventListener("change", () => {
    sessionStorage.setItem("set_weight", inputWeight.value)
})
inputWeightUnit.addEventListener("change", () => {
    sessionStorage.setItem("set_weight_unit", inputWeightUnit.value)
})
inputReps.addEventListener("change", () => {
    sessionStorage.setItem("set_reps", inputReps.value)
})
supersetCheckbox.addEventListener("change", () => {
    toggleVisibility()
    sessionStorage.setItem("superset", supersetCheckbox.checked)
})
inputSupersetExercise.addEventListener("change", () => {
    sessionStorage.setItem("superset_exercise", inputSupersetExercise.value)
})
inputSupersetWeight.addEventListener("change", () => {
    sessionStorage.setItem("superset_weight", inputSupersetWeight.value)
})
inputSupersetWeightUnit.addEventListener("change", () => {
    sessionStorage.setItem("superset_weight_unit", inputSupersetWeightUnit.value)
})
inputSupersetReps.addEventListener("change", () => {
    sessionStorage.setItem("superset_reps", inputSupersetReps.value)
})