$(document).ready(function () {

    // =========================
    // LOGIN
    // =========================
    $("#Login").click(function () {

        const email = $("#email").val().trim();
        const password = $("#password").val();

        if (!email || !password) {
            $("#feedback")
                .removeClass("text-success")
                .addClass("text-danger")
                .text("Vui lòng nhập email và password.");
            return;
        }

        $.ajax({
            url: "/auth/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                email: email,
                password: password
            }),

            success: function (response) {

                // Lưu JWT
                localStorage.setItem("token", response.token);

                // Lưu thời gian hết hạn nếu cần
                localStorage.setItem(
                    "expiresIn",
                    response.expiresIn
                );

                $("#feedback")
                    .removeClass("text-danger")
                    .addClass("text-success")
                    .text("Đăng nhập thành công!");

                // Chuyển sang trang Profile
                setTimeout(function () {
                    window.location.href = "/user/profile";
                }, 300);

            },

            error: function (xhr) {

                let message = "Đăng nhập thất bại.";

                if (xhr.responseJSON) {
                    if (xhr.responseJSON.message) {
                        message = xhr.responseJSON.message;
                    }
                }

                $("#feedback")
                    .removeClass("text-success")
                    .addClass("text-danger")
                    .text(message);
            }
        });
    });


    // =========================
    // PROFILE
    // =========================
    if ($("#profile").length > 0) {

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        $.ajax({
            url: "/users/me",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },

            success: function (user) {

                $("#profile").text(user.fullName);
                $("#emailProfile").text(user.email);

                if (user.images) {
                    $("#images")
                        .attr("src", user.images)
                        .removeClass("d-none");
                }
            },

            error: function (xhr) {

                // Token không hợp lệ / hết hạn
                if (xhr.status === 401 || xhr.status === 403) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("expiresIn");

                    window.location.href = "/login";
                }
            }
        });
    }


    // =========================
    // LOGOUT
    // =========================
    $("#logout").click(function () {

        localStorage.removeItem("token");
        localStorage.removeItem("expiresIn");

        window.location.href = "/login";
    });

});