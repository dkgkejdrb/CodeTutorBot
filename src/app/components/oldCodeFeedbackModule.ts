export const review_roleSettingPrompt =
    `역할: 선생님
작업: 학생이 제출한 [코드]에 대한 코드 리뷰 제공
목적: [파이썬 문제] 해결 돕기`

export const reviewNecessityPredictionPrompt =
    `[정답코드]를 참고하여 코드 리뷰가 필요한 경우, '예' 또는 '아니오'로 [RNP][/RNP]에 응답. '아니오'라면, 응답 종료.`

export const reviewCommentGenerationPrompt_styleTone =
    `초등학교 5학년이 이해할 수 있는 어휘 난이도로 리뷰.`

export const reviewCommentGenerationPrompt_instruction =
    `[응답예시][/응답예시]와 같이 [RNP][/RNP]와 [RC][/RC]와 [R][/R]이 응답에 반드시 포함. [코드]에서 잘못된 코드 라인의 맨 끝에 '수정 필요' 주석 추가. 주석이 추가된 [코드]를 그대로 [RC][/RC]에 응답.`

export const reviewCommentGenerationPrompt_restriction =
    `단, [RC][/RC]와 [R][/R]에 코드를 직접 수정하거나 수정된 코드를 절대 직접 제시하지 해서는 안됨.`
export const reviewCommentGenerationPrompt_solution: any = {
    1173: `print("'코로나 블루'","극복하기",sep=', ',end='!')`,
    1175: `print(input())`,
    1177: `print("물냉면\n\n\t비빔냉면")`,
    1178: `print("1\n\n2\n\n3\n\n4\n\n5")`,
    1213: `a=1
    print(a,a+1,a+2,a+3,a+4,sep=' ')`,
    1216: `length=42.195
    print('마라톤의 거리는 %fkm'%length)
    print('마라톤의 거리는 %0.2fkm'%length)`,
    1221: `x=int(input())
    print("%d" %x)
    print("%.1f" %(x/1000))
    print("%.3f" %(x/1000000))`,
    1222: `x=int(input())
    y=int(input())
    print(x*y/100)
    print((x+x+y+y)/10)`,
    1269: `n=int(input())
    d1=n%10
    d2=n//10%10
    d3=n//10//10
    print(d1+d2+d3)`,
    1291: `x=int(input())
    print(x%2)`,
    1293: `w=int(input())
    h=int(input())
    h=h*0.01
    print("%.1f" %(w/(h*h)))`,
    1332: `anna="""ELSA?
    Do you want to build a snowman?
    Come on, let's go and play!
    I never see you anymore
    Come out the door
    It's like you've gone away
    We used to be best buddies
    And now we're not
    I wish you would tell me why!
    Do you want to build a snowman?
    It doesn't have to be a snowman
    Go away, ANNA
    Okay, bye"""
    print(anna.count("snowman"))
    print(anna.index("ANNA"))
    anna.replace("a snowman", "Olaf")
    print(anna)`,
    1334: `city=['New York', 'Bangkok', 'Tokyo', 'Lodon']
    asia=[ ]
    city.append('Seoul')
    city.append('Beijing')
    asia=city[1:3]+city[4:]
    print(asia)`,
    1335: `city=['New York', 'Bangkok', 'Tokyo', 'Lodon']
    asia=[ ]
    city.append('Seoul')
    city.append('Beijing')
    asia=city[1:3]+c+D39`,
    1376: `a=int(input())
    b=int(input())
    a+=b
    print(a)
    a-=b
    print(a)
    a*=b
    print(a)
    a/=b
    print(a)`,
    1382: `a=1
    b=2
    if (a==b):
        print(1)
    else:
        print(0)`,
    1385: `a=int(input())
    if(a<0):
        print("음수")
    elif(a>0):
        print("양수")
    else:
        print(0)`,
    1400: `tuple_spring=('March', 'April', 'May')
    print(tuple_spring)
    list_spring=list(tuple_spring)
    print(list_spring)`,
    1401: `ar=(1, 2, 3)
    br=list(ar)
    tmp=br[2]
    br[2]=br[1]
    br[1]=tmp
    br=tuple(br)
    print(br)`,
    1422: `n = 1
    while n <= 10:
        mod = n % 2
        if mod == 1:
            print("O", end = ' ')
        else:
            print("X", end = ' ')
        n += 1`,
    1430: `n = 1
    while n<=10:
        print(n*(-1)**(n+1), end = ' ')
        n += 1`,
    1460: `for i in range(5):
    print(i, end = ' ')
print()

for i in range(1, 6):
    print(i, end = ' ')
print()

for i in range(1, 10, 2):
    print(i, end = ' ')
print()

for i in range(5, 0, -1):
    print(i, end = ' ')
print()`,
    1461: `n = int(input())

    for i in range(n):
        print("*", end = ' ')`,
    1462: `score = [89.5, 99.2, 88, 75.6, 66]
    sum = 0
    
    for i in range(5):
        sum += score[i]
    print('%.1f %.1f' % (sum, sum/5))`,
    1465: `n = int(input())

    for i in range(2, n+1, 2):
        print(i, end = ' ')`,
    1466: `for i in range(2, 10, 1):
    for j in range(1, 10, 1):
        print("%dX%d=%d" % (i, j, i*j), end = ' ')
    print()`,
    1467: `n = int(input())

    for i in range(1, n+1, 1):
        for j in range(i):
            print("*", end = '')
        print()`,
    1470: `words = []
    word_list = ['scramble', 'freindly', 'do', 'learn']
    for i in word_list:
        word = "un"+i
        words.append(word)
    print(words)`,
    1187: `def addFourNums():
    s = 0
    for i in range(4):
        n = int(input())
        s += n
    return s

print(addFourNums())`,
    1189: `def drawStars(n):
    res = ''
    for i in range(n-1):
        res = res + '* '
    res = res + '*'
    return res

n = int(input())
print(drawStars(n))`,
    1226: `def printBirthday(m, d):
    print("My Birthday is %d/%d" % (m, d))

m = int(input())
d = int(input())
printBirthday(m, d)`,
    1229: `def Sum(a, b, c):
    s = a+b+c
    return s
    
def avg(a, b, c):
    s = Sum(a, b, c)
    avg = s/3
    return avg
    
a = int(input())
b = int(input())
c = int(input())

print(Sum(a, b, c))
print(avg(a, b, c))`
}



export const reviewCommentGenerationPrompt_example =
    `
[응답예시]
length = 42.195
print("마라톤의 거라는 %.fkm" %length) #수정 필요
print("마라톤의 거리는 %.2fkm" %length)

마라톤 거리를 저장하고 출력하는 부분을 잘 구현하셨습니다. 다만, 첫 번째 줄의 print 함수에 오탈자가 있네요. '거라는' 대신 '거리는'이 올바른 표현입니다. 오타를 조금 더 신경써서 확인해보세요!    
[/응답예시]`