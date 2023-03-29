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


$("#superset-input").click(function () {
    $header = $(this)
    $content = $header.nextAll()
    $content.slideToggle(500, toggleRequired())
})
const toggleRequired = () => {
    const supersetExercise = document.getElementById("superset-exercise-input")
    
    // If superset is selected, the respective inputs are marked as visible and the exercise name is now required
    if (supersetCheckbox.checked) {
        supersetExercise.setAttribute("required", "true")
    // If it is unselected it resets the inputs to again be hidden, and exercise name is no longer required to submit the form
    } else {
        supersetExercise.removeAttribute("required")
    }
}
const toggleVisibility = () => {
    if (supersetCheckbox.checked) {
        $("#superset-input").nextAll().slideDown(0)
    } else {
        $("#superset-input").nextAll().slideUp(0)
    }
}
toggleVisibility()
/* 
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

    toggleRequired()
}

 */

supersetCheckbox.addEventListener("change", () => {
    toggleRequired()
})


/* document.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", () => {
        updateSessionStorage()
    })
})

const updateSessionStorage = () => {
    sessionStorage.setItem("date", inputDate.value)
    sessionStorage.setItem("exercise_name", inputExercise.value)
    sessionStorage.setItem("set_weight", inputWeight.value)
    sessionStorage.setItem("set_weight_unit", inputWeightUnit.value)
    sessionStorage.setItem("set_reps", inputReps.value)
    sessionStorage.setItem("superset", supersetCheckbox.checked)
    sessionStorage.setItem("superset_exercise", inputSupersetExercise.value)
    sessionStorage.setItem("superset_weight", inputSupersetWeight.value)
    sessionStorage.setItem("superset_weight_unit", inputSupersetWeightUnit.value)
    sessionStorage.setItem("superset_reps", inputSupersetReps.value)
} */

toggleVisibility()