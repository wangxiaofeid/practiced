## ReactDom.render过程
1. render的第一个元素调用createElementWithValidation —> createElement生成ReactElement
2. createElement会new ReactElement,返回ReactElement
3. createElementWithValidation对ReactElement做些校验，然后返回
4. 执行ReactDOM.render
5. 执行legacyRenderSubtreeIntoContainer
6. isValidContainer校验跟节点是否是dom元素
7. topLevelUpdateWarnings 
8. getReactRootElementInContainer 根据不同的nodeType返回根节点（[nodeType](http://www.w3school.com.cn/jsref/prop_node_nodetype.asp)）----7,8还是在校验根节点
9. 根据_reactRootContainer判断当前component是否是插入到其他component的元素，如果是则直接插入，如果不是，新建一个跟渲染空间
10. legacyCreateRootFromDOMContainer创建一个根渲染空间
11. shouldHydrateDueToLegacyHeuristic 判断传入的节点是否已经是react节点
12. new ReactRoot()
13. createContainer()
14. createFiberRoot() --> 
15. createHostRootFiber
  * createFiber
  * new FiberNode()  --> 保存了一些状态
16. ReactRoot.render()
17. updateContainer()
18. requestCurrentTime() --> computeExpirationForFiber() --> updateContainerAtExpirationTime()

19. updateContainerAtExpirationTime()  --> 
20. scheduleRootUpdate()
21. enqueueUpdate()  createUpdateQueue()  appendUpdateToQueue()
22. scheduleWork()  recordScheduleUpdate() scheduleWorkToRoot() storeInteractionsForExpirationTime() markPendingPriorityLevel() findNextExpirationTimeToWorkOn()
23. requestWork() addRootToSchedule()
24. performSyncWork()
25. performWork() findHighestPriorityRoot()
26. 
27. 
28. 
29. 
30. 
31. 
32. 
33. 


## Component.setState过程
1. this.updater.enqueueSetState
2. requestCurrentTime
computeExpirationForFiber
createUpdate
enqueueUpdate
createUpdateQueue
appendUpdateToQueue

scheduleWork
scheduleWorkToRoot
storeInteractionsForExpirationTime
markPendingPriorityLevel
findNextExpirationTimeToWorkOn
requestWork
addRootToSchedule

performSyncWork
performWork
performWorkOnRoot
renderRoot
resetStack
createWorkInProgress
startWorkLoopTimer
workLoop
performUnitOfWork
beginWork
bailoutOnAlreadyFinishedWork
stopProfilerTimerIfRunningAndRecordDelta

findHighestPriorityRoot



diff:
reconcileChildFibers reconcileChildrenArray  diffProperties