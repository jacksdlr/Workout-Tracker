const supersetCheckDiv = document.querySelector("#superset-check")
const supersetCheckbox = document.querySelector("#superset-input")
supersetCheckbox.addEventListener("change", () => {
    if (supersetCheckbox.checked) {
        // superset exercise input
        const supersetExercise = document.createElement("div")
        supersetExercise.classList.add("superset-input-container", "input-container")

        const supersetExerciseLabel = document.createElement("label")
        supersetExerciseLabel.setAttribute("for", "superset-exercise-input")
        supersetExerciseLabel.insertAdjacentText("afterbegin", "Exercise: ")

        const supersetExerciseInput = document.createElement("input")
        supersetExerciseInput.setAttribute("type", "text")
        supersetExerciseInput.setAttribute("name", "superset-exercise-name")
        supersetExerciseInput.setAttribute("id", "superset-exercise-input")

        supersetExercise.appendChild(supersetExerciseLabel)
        supersetExercise.appendChild(supersetExerciseInput)

        supersetCheckDiv.append(supersetExercise)
        
        // superset weight input
        const supersetWeight = document.createElement("div")
        supersetWeight.classList.add("superset-input-container", "input-container")

        const supersetWeightLabel = document.createElement("label")
        supersetWeightLabel.setAttribute("for", "superset-weight-input")
        supersetWeightLabel.insertAdjacentText("afterbegin", "Weight used: ")

        const supersetWeightInput = document.createElement("input")
        supersetWeightInput.setAttribute("type", "number")
        supersetWeightInput.setAttribute("name", "superset-weight-used")
        supersetWeightInput.setAttribute("id", "superset-weight-input")
        supersetWeightInput.setAttribute("min", "0")
        supersetWeightInput.setAttribute("step", "0.01")

        const supersetWeightUnit = document.createElement("select")
        supersetWeightUnit.setAttribute("name", "superset-weight-unit")
        
        const supersetWeightUnitKg = document.createElement("option")
        supersetWeightUnitKg.setAttribute("value", "kg")
        supersetWeightUnitKg.insertAdjacentText("afterbegin", "kg")
        const supersetWeightUnitLbs = document.createElement("option")
        supersetWeightUnitLbs.setAttribute("value", "lbs")
        supersetWeightUnitLbs.insertAdjacentText("afterbegin", "lbs")

        supersetWeightUnit.appendChild(supersetWeightUnitKg)
        supersetWeightUnit.appendChild(supersetWeightUnitLbs)

        supersetWeight.appendChild(supersetWeightLabel)
        supersetWeight.appendChild(supersetWeightInput)
        supersetWeight.appendChild(supersetWeightUnit)

        supersetCheckDiv.append(supersetWeight)

        // superset reps input
        const supersetReps = document.createElement("div")
        supersetReps.classList.add("superset-input-container", "input-container")

        const supersetRepsLabel = document.createElement("label")
        supersetRepsLabel.setAttribute("for", "superset-reps-input")
        supersetRepsLabel.insertAdjacentText("afterbegin", "Repetitions: ")

        const supersetRepsInput = document.createElement("input")
        supersetRepsInput.setAttribute("type", "number")
        supersetRepsInput.setAttribute("name", "superset-reps-performed")
        supersetRepsInput.setAttribute("id", "superset-reps-input")
        supersetRepsInput.setAttribute("min", "0")

        supersetReps.appendChild(supersetRepsLabel)
        supersetReps.appendChild(supersetRepsInput)

        supersetCheckDiv.append(supersetReps)
        
    } else {
        const lastSuperset = document.querySelectorAll(".superset-input-container", "input-container")
        lastSuperset.forEach((superset) => {
            superset.remove()
        })
    }
})