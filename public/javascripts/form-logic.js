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
// Checks for changes in the superset checkbox


const toggleVisibility = () => {
    const supersetInputContainers = document.querySelectorAll(".superset-input-container")
    const supersetExercise = document.getElementById("superset-exercise-input")
    // If superset is selected, the respective inputs are marked as visible and the exercise name is now required
    if (supersetCheckbox.checked) {
        supersetInputContainers.forEach((container) => {
            container.style.visibility = "visible"
            container.style.display = "block"
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
    inputExercise.value = localStorage.getItem("exercise_name")
    inputWeight.value = localStorage.getItem("set_weight")
    if (localStorage.getItem("set_weight_unit") == "kg") {
        inputWeightKg.setAttribute("selected", "selected")
        inputWeightLbs.removeAttribute("selected")
    } else {
        inputWeightKg.removeAttribute("selected")
        inputWeightLbs.setAttribute("selected", "selected")
    }
    inputReps.value = localStorage.getItem("set_reps")
    if (localStorage.getItem("superset") == "true") {
        supersetCheckbox.checked = "on"
    } else {
        supersetCheckbox.removeAttribute("checked")
        localStorage.setItem("superset_exercise", "")
        localStorage.setItem("superset_weight", "")
        localStorage.setItem("superset_weight_unit", "kg")
        localStorage.setItem("superset_reps", "")
    }
    inputSupersetExercise.value = localStorage.getItem("superset_exercise")
    inputSupersetWeight.value = localStorage.getItem("superset_weight")
    if (localStorage.getItem("superset_weight_unit") == "kg") {
        inputSupersetWeightKg.setAttribute("selected", "selected")
        inputSupersetWeightLbs.removeAttribute("selected")
    } else {
        inputSupersetWeightKg.removeAttribute("selected")
        inputSupersetWeightLbs.setAttribute("selected", "selected")
    }
    inputSupersetReps.value = localStorage.getItem("superset_reps")

    console.log(localStorage)
    console.log("at least I made it here")
    toggleVisibility()
}

inputExercise.addEventListener("change", () => {
    localStorage.setItem("exercise_name", inputExercise.value)
})
inputWeight.addEventListener("change", () => {
    localStorage.setItem("set_weight", inputWeight.value)
})
inputWeightUnit.addEventListener("change", () => {
    localStorage.setItem("set_weight_unit", inputWeightUnit.value)
})
inputReps.addEventListener("change", () => {
    localStorage.setItem("set_reps", inputReps.value)
})
supersetCheckbox.addEventListener("change", () => {
    toggleVisibility()
    localStorage.setItem("superset", supersetCheckbox.checked)
})
inputSupersetExercise.addEventListener("change", () => {
    localStorage.setItem("superset_exercise", inputSupersetExercise.value)
})
inputSupersetWeight.addEventListener("change", () => {
    localStorage.setItem("superset_weight", inputSupersetWeight.value)
})
inputSupersetWeightUnit.addEventListener("change", () => {
    localStorage.setItem("superset_weight_unit", inputSupersetWeightUnit.value)
})
inputSupersetReps.addEventListener("change", () => {
    localStorage.setItem("superset_reps", inputSupersetReps.value)
})