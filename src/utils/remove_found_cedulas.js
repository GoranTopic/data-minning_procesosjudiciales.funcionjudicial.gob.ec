// Function to process the lists
function remove_found_cedulas(list1, list2) {
    // Create a map from the first list
    let map = new Map(list1.map(item => [item, true]));

    // Iterate over the second list and delete matching items from the map
    list2.forEach(item => {
        if (map.has(item)) {
            map.delete(item);
        }
    });

    // Convert the remaining map keys to an array and return
    return Array.from(map.keys());
}

export default remove_found_cedulas;