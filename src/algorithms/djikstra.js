/* eslint-disable no-unused-vars */
class Node {
    constructor(cellData) {
        this.weight = cellData.weight;
        this.isWall = cellData.isWall;
    }
}

class Graph {
    constructor(cellArr) {
        this.matrix = {};
        this.rows = cellArr.length;
        this.columns = cellArr[0].length;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.matrix[`${i}_${j}`] = new Node(cellArr[i][j]);
            }
        }
    }

    setWalls(wallsArr) {
        for (let i = 0; i < wallsArr.length; i++) {
            let node = wallsArr[i];
            this.matrix[node].weight = Infinity;
            this.matrix[node].isWall = true;
        }
    }

    /* Djikstra methods */
    shortestDistanceNode(distances, visited) {
        let shortest = null;

        for (let node in distances) {
            let currentIsShortest = shortest === null || distances[shortest] > distances[node];

            if (currentIsShortest && !visited.includes(node)) {
                shortest = node;
            }
        }

        return shortest;
    }

    getChildren(node) {
        let [i_str, j_str] = node.split('_');
        let i = parseInt(i_str);
        let j = parseInt(j_str);

        let children = [];
        let di_dj_arr = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        di_dj_arr.forEach(([di, dj]) => {
            if (i + di >= 0 && j + dj >= 0 && i + di < this.rows && j + dj < this.columns && !this.matrix[`${i + di}_${j + dj}`].isWall) children.push(`${i + di}_${j + dj}`);
        })

        return children;

    }

    startDjikstra(start, end) {
        let distances = {}; // { id(string): distance(number) }
        // distances[end] = Infinity;

        let startNodeChildren = this.getChildren(start);
        for (let i = 0; i < startNodeChildren.length; i++) {
            let child = startNodeChildren[i];
            distances[child] = this.matrix[child].weight;
        }

        // console.log(distances);

        let parents = {};
        // parents[end] = null;
        for (let i = 0; i < startNodeChildren.length; i++) {
            let child = startNodeChildren[i];
            parents[child] = start;
        }

        // console.log(parents);

        let visited = [];

        let currNode = this.shortestDistanceNode(distances, visited);

        // console.log(currNode);

        while (currNode) {
            let distance = distances[currNode];
            let children = this.getChildren(currNode);

            // console.log(distance, children);

            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                if (child === start) continue;

                let newDistance = distance + this.matrix[child].weight;

                if (!distances[child] || distances[child] > newDistance) {
                    distances[child] = newDistance;
                    parents[child] = currNode;
                }
            }

            visited.push(currNode);
            currNode = this.shortestDistanceNode(distances, visited);
        }


        if (parents[end] === undefined) {
            return {
                path: [],
                exploredNodes: visited
            }
        }

        let shortestPath = [end];
        let parent = parents[end];
        while (parent) {
            shortestPath.push(parent);
            parent = parents[parent];
        }

        shortestPath.reverse();

        return {
            path: shortestPath,
            exploredNodes: visited
        }

    }
}

export default Graph;