exports.handler = async (event, context) => {
  // 只处理 POST 请求
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    // 解析表单数据
    const body = event.body
    const params = new URLSearchParams(body)
    const formData = {}

    for (const [key, value] of params.entries()) {
      formData[key] = value
    }

    // 验证表单名称
    if (formData["form-name"] !== "waitlist") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid form" }),
      }
    }

    // 这里可以添加额外的处理逻辑
    // 比如发送邮件、保存到数据库等

    console.log("Form submission:", formData)

    // 返回成功响应
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        message: "Form submitted successfully",
      }),
    }
  } catch (error) {
    console.error("Form submission error:", error)

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
    }
  }
}
