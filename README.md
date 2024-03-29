# 寻路算法

### 广度优先搜索

从 start 出发，遍历所有可能路径，可以找到最优解，但速度很慢

``` python
# 记录当前访问过的节点（当前可扩展边界）
frontier = Queue()
frontier.put(start)

# 记录每个节点的上一个节点（用于还原节点访问路径）
came_from = {}
came_from[start] = None

while not frontier.empty():
   current = frontier.get()

   # 找到 goal 就停止搜索
   if current == goal:
      break

   for next in graph.neighbors(current):
      if next not in came_from:
         frontier.put(next)
         came_from[next] = current

# 还原 start 到 goal 的路径
current = goal
path = []
while current != start:
   path.append(current)
   current = came_from[current]
path.append(start) # optional
path.reverse() # optional
```

### Dijkstra’s Algorithm

也可以视为特殊的广度搜索，区别在于：

* 每次探索下一步时，优先选择一个到 start 已知距离最小的点
* 每次扩展边界时：
    * 遇到未知的点直接加入
    * 遇到已知的点，判断是否需要更新到 start 的已知距离

可以找到最优解，速度可能比单纯的广度搜索快一点，但同样很慢

``` python
frontier = PriorityQueue()
frontier.put(start, 0)

came_from = {}
came_from[start] = None

cost_so_far = {}
cost_so_far[start] = 0

while not frontier.empty():
   current = frontier.get()  # 每次返回当前已知到 start 最小距离的点

   if current == goal:
      break

   for next in graph.neighbors(current):
      new_cost = cost_so_far[current] + graph.cost(current, next)
      if next not in cost_so_far or new_cost < cost_so_far[next]:
         cost_so_far[next] = new_cost
         priority = new_cost
         frontier.put(next, priority)
         came_from[next] = current
```

### Greedy Best First Search

贪婪算法，区别在于：

* 每次探索下一步时，优先选择与 goal 几何距离最近的点

速度有很大提升，但不一定能找到最优解

``` python
def heuristic(a, b):
   # Manhattan distance on a square grid
   return abs(a.x - b.x) + abs(a.y - b.y)

frontier = PriorityQueue()
frontier.put(start, 0)

came_from = {}
came_from[start] = None

while not frontier.empty():
   current = frontier.get()  # 每次返回当前已知到 start 最小距离的点

   if current == goal:
      break

   for next in graph.neighbors(current):
      if next not in came_from:
         priority = heuristic(goal, next)
         frontier.put(next, priority)
         came_from[next] = current
```

### A* algorithm

贪婪算法，结合了 Dijkstra's Algorithm 与 Greedy Best First Search：

* 每次探索下一步时，会优先选择到 start 的已知距离以及到 goal 的几何距离之和最小的点

速度相比 Greedy Best First Search 可能略微提升，同样不一定能找到最优解

``` python
def heuristic(a, b):
   # Manhattan distance on a square grid
   return abs(a.x - b.x) + abs(a.y - b.y)

frontier = PriorityQueue()
frontier.put(start, 0)

came_from = {}
came_from[start] = None

cost_so_far = {}
cost_so_far[start] = 0

while not frontier.empty():
   current = frontier.get()  # 每次返回当前已知到 start 最小距离的点

   if current == goal:
      break

   for next in graph.neighbors(current):
      new_cost = cost_so_far[current] + graph.cost(current, next)
      if next not in cost_so_far or new_cost < cost_so_far[next]:
         cost_so_far[next] = new_cost
         priority = new_cost + heuristic(goal, next)
         frontier.put(next, priority)
         came_from[next] = current
```
