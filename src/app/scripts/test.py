def check_and_execute_code(code: str):
    try:
        # 코드의 구문을 컴파일합니다.
        compiled_code = compile(code, '<string>', 'exec')

        # 컴파일에 성공하면 코드 실행
        exec(compiled_code)
        return "Code executed successfully."

    except SyntaxError as e:
        # 구문 오류가 발생한 경우 오류 메시지를 반환
        return f"SyntaxError: {e.msg} at line {e.lineno}, column {e.offset}"

    except Exception as e:
        # 실행 중에 발생한 다른 모든 오류를 처리
        return f"Error: {str(e)}"

# 테스트할 코드
code = """
x = 10
y = 20
print("Sum:", x + y)
"""

# 구문 체크 및 실행
result = check_and_execute_code(code)
print(result)