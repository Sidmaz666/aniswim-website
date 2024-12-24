function collapse_numbers(start, end, step) {
    let result = [];
    for (let i = start; i <= end; i += step) {
        result.push([i, Math.min(i + step - 1, end)]);
    }
    return result;
}


const useCollapseNumber = (start,end, step=100) => {
    const collapsed_nums = collapse_numbers(start,end,step)
    const ids = []
    const collapsed_nums_array = []
    for (let index = 0; index < collapsed_nums.length; index++) {
        const element = collapsed_nums[index];
        const id =  `${element[0]}-${element[element.length - 1]}-index:${index}`  
        const arr = []
        for (let j = element[0]; j <= element[element.length - 1]; j++) {
                arr.push(j)
        }
        collapsed_nums_array.push(arr)
        ids.push(id)
    }

    return {
        collapsed_nums_array,
        short_form:ids
    }
}

export function findIndexForNumber(number, total, gap) {
    if(!number || !total || !gap) return -1
    if (number < 1 || number > total) {
        throw new Error("Number must be within the range of 1 and total.");
    }
    return Math.floor((number - 1) / gap);
}
  

export default useCollapseNumber