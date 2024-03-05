const _userConnections = {}

export function getAllUsersInfo() {
    const updatedUser = Object.fromEntries(
        Object.entries(_userConnections).map(([userId, { data, ...rest }]) => [userId, { ...rest, data: data.length }])
    );

    // Convert the object to an array
    const dataArray = Object.entries(updatedUser).map(([key, value]) => ({ key, ...value }));

    // Sort the array based on updatedAt or createdAt if updatedAt is not present
    dataArray.sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt);
        const bTime = b.updatedAt ? new Date(b.updatedAt) : new Date(b.createdAt);

        if (!a.updatedAt && b.updatedAt) {
            return -1; // If only 'a' doesn't have updatedAt, consider it smaller
        } else if (a.updatedAt && !b.updatedAt) {
            return 1; // If only 'b' doesn't have updatedAt, consider it smaller
        }

        const timeDifference = bTime.getTime() - aTime.getTime();

        if (timeDifference !== 0) {
            return timeDifference;
        }

        // If timestamps are equal, sort by data
        return b.data - a.data;
    });

    // Convert the array back to an object
    const sortedDataObject = dataArray.reduce((acc, item) => {
        const { key, ...rest } = item;
        acc[key] = rest;
        return acc;
    }, {});

    let usersData = Object.keys(sortedDataObject).map(key => {
        return {
            id: key,
            ...sortedDataObject[key]
        };
    });
    return usersData;
}

export default _userConnections;