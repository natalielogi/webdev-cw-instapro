import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { getPosts } from "../api.js";
import { goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl, token, userId }) {
  console.log("Загружаем посты...");

  getPosts({ token })
    .then((posts) => {
      console.log("Актуальный список постов:", posts);

      let filteredPosts = posts
      if (userId) {
        filteredPosts = posts.filter((post) => post.user.id === userId)
      }

      const postsHtml = filteredPosts
        .map((post) => {
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
              <button data-post-id="${post.id}" class="like-button">
                <img src="./assets/images/${
                  post.isLiked ? "like-active.svg" : "like-not-active.svg"
                }">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${post.likes}</strong>
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

      for (let userEl of document.querySelectorAll(".post-header")) {
        userEl.addEventListener("click", () => {
          goToPage(USER_POSTS_PAGE, {
            userId: userEl.dataset.userId,
          });
        });
      }
    })
    .catch((error) => {
      console.error("Ошибка загрузки постов:", error);
      appEl.innerHTML = `<p class="error-message">Ошибка загрузки постов: ${error.message}</p>`;
    });
}
