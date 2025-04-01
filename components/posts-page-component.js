import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { getPosts, toggleLike, postsHost } from "../api.js";
import { goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl, token, userId }) {
  console.log("Загружаем посты...");

  getPosts({ token })
    .then((posts) => {
      console.log("Актуальный список постов:", posts);

      let filteredPosts = posts;
      if (userId) {
        filteredPosts = posts.filter((post) => post.user.id === userId);
      }

      const postsHtml = filteredPosts
        .map((post) => {
          const likesCount =
            post.likes && Array.isArray(post.likes)
              ? post.likes.length
              : post.likes || 0;

          return `
          <li class="post">
            <div class="post-header" data-user-id="${post.user.id}">
                <img src="${
                  post.user.imageUrl
                }" class="post-header__user-image">
                <p class="post-header__user-name">${post.user.name}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
              <button data-post-id="${post.id}" data-is-liked="${
            post.isLiked
          }" class="like-button">
                <img src="./assets/images/${
                  post.isLiked ? "like-active.svg" : "like-not-active.svg"
                }">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${likesCount}</strong>
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${post.user.name}</span>
              ${post.description}
            </p>
            <p class="post-date">
              ${new Date(post.createdAt).toLocaleString()}
            </p>
          </li>`;
        })
        .join("");

      appEl.innerHTML = `
      <div class="page-container">
        <div class="header-container"></div>
        <ul class="posts">
          ${postsHtml}
        </ul>
      </div>`;

      renderHeaderComponent({
        element: document.querySelector(".header-container"),
      });

      document.querySelectorAll(".post-header").forEach((userEl) => {
        userEl.addEventListener("click", () => {
          goToPage(USER_POSTS_PAGE, {
            userId: userEl.dataset.userId,
          });
        });
      });
      document.querySelectorAll(".like-button").forEach((button) => {
        button.addEventListener("click", () => {
          const postId = button.dataset.postId;
          const isLiked = button.dataset.isLiked === "true";
          console.log(
            "Нажат лайк для поста:",
            postId,
            "Текущий статус:",
            isLiked
          );

          toggleLike({ token, postId, isLiked })
            .then((updatedPost) => {
              console.log("Обновленный пост:", updatedPost);
              goToPage(POSTS_PAGE);
            })
            .catch((error) => {
              console.error("Ошибка при переключении лайка:", error);
              alert(error.message);
            });
        });
      });
    })
    .catch((error) => {
      console.error("Ошибка загрузки постов:", error);
      appEl.innerHTML = `<p class="error-message">Ошибка загрузки постов: ${error.message}</p>`;
    });
}
