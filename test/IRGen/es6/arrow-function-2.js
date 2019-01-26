// RUN: %hermesc -Xflow-parser -dump-ir %s | %FileCheck --match-full-lines %s
// REQUIRES: flowparser

function outer1() {
    var innerArrow1 = () => this.x;
    var innerArrow2 = () => this.y;
}
//CHECK-LABEL:function outer1()
//CHECK-NEXT:frame = [innerArrow1, innerArrow2, ?anon_0_this]
//CHECK-NEXT:%BB0:
//CHECK-NEXT:  %0 = StoreFrameInst undefined : undefined, [innerArrow1]
//CHECK-NEXT:  %1 = StoreFrameInst undefined : undefined, [innerArrow2]
//CHECK-NEXT:  %2 = StoreFrameInst %this, [?anon_0_this]
//CHECK-NEXT:  %3 = CreateFunctionInst %innerArrow1()
//CHECK-NEXT:  %4 = StoreFrameInst %3 : closure, [innerArrow1]
//CHECK-NEXT:  %5 = CreateFunctionInst %innerArrow2()
//CHECK-NEXT:  %6 = StoreFrameInst %5 : closure, [innerArrow2]
//CHECK-NEXT:  %7 = ReturnInst undefined : undefined
//CHECK-NEXT:function_end

//CHECK-LABEL:arrow innerArrow1()
//CHECK-NEXT:frame = []
//CHECK-NEXT:%BB0:
//CHECK-NEXT:  %0 = LoadFrameInst [?anon_0_this@outer1]
//CHECK-NEXT:  %1 = LoadPropertyInst %0, "x" : string
//CHECK-NEXT:  %2 = ReturnInst %1
//CHECK-NEXT:%BB1:
//CHECK-NEXT:  %3 = ReturnInst undefined : undefined
//CHECK-NEXT:function_end

//CHECK-LABEL:arrow innerArrow2()
//CHECK-NEXT:frame = []
//CHECK-NEXT:%BB0:
//CHECK-NEXT:  %0 = LoadFrameInst [?anon_0_this@outer1]
//CHECK-NEXT:  %1 = LoadPropertyInst %0, "y" : string
//CHECK-NEXT:  %2 = ReturnInst %1
//CHECK-NEXT:%BB1:
//CHECK-NEXT:  %3 = ReturnInst undefined : undefined
//CHECK-NEXT:function_end

function outer2() {
    function inner3() {
        return this.a;
    }
    var innerArrow4 = () => {
        this.b = 10;
        var nestedInnerArrow5 = () => {
            return this.b;
        }
    }
}
//CHECK-LABEL:function outer2()
//CHECK-NEXT:frame = [innerArrow4, inner3, ?anon_0_this]
//CHECK-NEXT:%BB0:
//CHECK-NEXT:  %0 = StoreFrameInst undefined : undefined, [innerArrow4]
//CHECK-NEXT:  %1 = StoreFrameInst %this, [?anon_0_this]
//CHECK-NEXT:  %2 = CreateFunctionInst %inner3()
//CHECK-NEXT:  %3 = StoreFrameInst %2 : closure, [inner3]
//CHECK-NEXT:  %4 = CreateFunctionInst %innerArrow4()
//CHECK-NEXT:  %5 = StoreFrameInst %4 : closure, [innerArrow4]
//CHECK-NEXT:  %6 = ReturnInst undefined : undefined
//CHECK-NEXT:function_end

//CHECK-LABEL:function inner3()
//CHECK-NEXT:frame = []
//CHECK-NEXT:%BB0:
//CHECK-NEXT:  %0 = LoadPropertyInst %this, "a" : string
//CHECK-NEXT:  %1 = ReturnInst %0
//CHECK-NEXT:%BB1:
//CHECK-NEXT:  %2 = ReturnInst undefined : undefined
//CHECK-NEXT:function_end

//CHECK-LABEL:arrow innerArrow4()
//CHECK-NEXT:frame = [nestedInnerArrow5]
//CHECK-NEXT:%BB0:
//CHECK-NEXT:  %0 = StoreFrameInst undefined : undefined, [nestedInnerArrow5]
//CHECK-NEXT:  %1 = LoadFrameInst [?anon_0_this@outer2]
//CHECK-NEXT:  %2 = StorePropertyInst 10 : number, %1, "b" : string
//CHECK-NEXT:  %3 = CreateFunctionInst %nestedInnerArrow5()
//CHECK-NEXT:  %4 = StoreFrameInst %3 : closure, [nestedInnerArrow5]
//CHECK-NEXT:  %5 = ReturnInst undefined : undefined
//CHECK-NEXT:function_end

//CHECK-LABEL:arrow nestedInnerArrow5()
//CHECK-NEXT:frame = []
//CHECK-NEXT:%BB0:
//CHECK-NEXT:  %0 = LoadFrameInst [?anon_0_this@outer2]
//CHECK-NEXT:  %1 = LoadPropertyInst %0, "b" : string
//CHECK-NEXT:  %2 = ReturnInst %1
//CHECK-NEXT:%BB1:
//CHECK-NEXT:  %3 = ReturnInst undefined : undefined
//CHECK-NEXT:function_end
