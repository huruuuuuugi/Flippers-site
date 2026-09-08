const menuButton = document.querySelector('.menu-button');
const menuClose = document.querySelector('.menu-close');
const drawer = document.querySelector('#drawer');
const scrim = document.querySelector('.drawer-scrim');

function openMenu() {
    drawer.classList.add('is-open');
    scrim.classList.add('is-open');

    menuButton.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    drawer.classList.remove('is-open');
    scrim.classList.remove('is-open');

    menuButton.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';

    // フォーカスを戻す
    menuButton.focus({ preventScroll: true });
}

menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});


// ×ボタンを押したら閉じる
menuClose.addEventListener('click', closeMenu);


// 背景を押したら閉じる
scrim.addEventListener('click', closeMenu);


// Escapeキーで閉じる
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMenu();
    }
});

// メニュー内のリンクをクリックしたら閉じる
const menuLinks = drawer.querySelectorAll('a');

menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
});

// フリッパーズについてのスライダー
const swiper = new Swiper('.swiper', {
    slidesPerView: 1.15,
    centeredSlides: true,
    spaceBetween: 16,
    loop: true,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    on: {
        init: function () {
            updatePrevButton(this);
        },

        slideChange: function () {
            updatePrevButton(this);
        }
    }
});

function updatePrevButton(swiper) {
    const prevButton = document.querySelector('.swiper-button-prev');

    if (swiper.realIndex === 0) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = '';
    }
}

// アコーディオン
const accordionButtons = document.querySelectorAll(".acc-question");

accordionButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const currentAcc = button.closest(".acc");
        const currentBody = currentAcc.querySelector(".acc-body");
        const isOpen = currentAcc.classList.contains("is-open");

        // ほかのアコーディオンを閉じる
        document.querySelectorAll(".acc.is-open").forEach((acc) => {

            const body = acc.querySelector(".acc-body");
            const btn = acc.querySelector(".acc-question");

            body.style.height = "0px";
            acc.classList.remove("is-open");
            btn.setAttribute("aria-expanded", "false");
        });

        // クリックしたアコーディオンを開く
        if (!isOpen) {

            currentBody.style.height = currentBody.scrollHeight + "px";
            currentAcc.classList.add("is-open");
            button.setAttribute("aria-expanded", "true");

        }

    });

});

// マップ//
$(function () {

    // ここを、実際のページの各コーナーのセクション要素に合わせて調整
    const $sections = $('.shop-box');       // 例: 各コーナーのラッパー要素
    const $navLinks = $('.fm-nav a');
    const $markers = $('.fm-marker');

    function setActive(corner) {
        $navLinks.removeClass('active');
        $navLinks.filter('[data-corner="' + corner + '"]').addClass('active');
        $markers.removeClass('active');
        $('#fm2-' + corner).addClass('active');
    }

    function updateScrollspy() {
        if ($sections.length === 0) return;
        const viewMid = $(window).scrollTop() + $(window).height() * 0.4;
        let current = $sections.first().attr('id').replace('sec', '');
        $sections.each(function () {
            if ($(this).offset().top <= viewMid) {
                current = $(this).attr('id').replace('sec', '');
            }
        });
        setActive(current);
    }
    $(window).on('scroll', updateScrollspy);
    updateScrollspy();

    $navLinks.on('click', function (e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        $('#map-modal-overlay').fadeOut(180);
        $('html, body').animate({ scrollTop: target.offset().top - 90 }, 500);
    });

    $markers.on('click', function () {
        const corner = $(this).data('corner');
        const target = $('#sec' + corner);

        $('#map-modal-overlay').fadeOut(180);

        $('html, body').animate({
            scrollTop: target.offset().top - 90
        }, 500);
    });
    $('#map-fab-btn').on('click', function () {
        $('#map-modal-overlay').css('display', 'flex').hide().fadeIn(200);
    });
    $('#map-modal-close, #map-modal-overlay').on('click', function (e) {
        if (e.target === this) { $('#map-modal-overlay').fadeOut(200); }
    });
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') { $('#map-modal-overlay').fadeOut(200); }
    });


    // ジャンル選択
    $('.genre').on('change', function () {

        const selectedGenre = $(this).val();

        $('.item-card').each(function () {

            const itemGenre = $(this).data('genre');

            if (selectedGenre === '' || selectedGenre === itemGenre) {
                $(this).show();
            } else {
                $(this).hide();
            }

        });

    });

    // item-cardのライトボックス
    $(function () {

        const $items = $('.js-item');
        let currentIndex = 0;

        // ライトボックスの内容を表示する
        function renderItemModal() {
            const $item = $items.eq(currentIndex);

            // 商品画像を取得
            const imgSrc = $item.find('img').attr('src');
            const imgAlt = $item.find('img').attr('alt');

            // 商品名を取得
            const itemName = $item.find('p').text();

            // ライトボックスに表示

            $('#item-modal-img').attr('src', imgSrc);
            $('#item-modal-img').attr('alt', imgAlt);
            $('#item-modal-desc').text(itemName);
        }

        $items.on('click', function () {
            // 何番目の商品か取得
            currentIndex = $items.index(this);
            // ライトボックスの内容を更新
            renderItemModal();
            // ライトボックスを表示
            $('#item-modal-overlay').css('display', 'flex').hide().fadeIn(200);
        });

        // ← 前の商品
        $('#item-modal-prev').on('click', function () {
            currentIndex = (currentIndex - 1 + $items.length) % $items.length;
            renderItemModal();
        });


        // → 次の商品
        $('#item-modal-next').on('click', function () {
            currentIndex = (currentIndex + 1) % $items.length;
            renderItemModal();
        });

        // ×で閉じる
        $('#item-modal-close').on('click', function () {
            $('#item-modal-overlay').fadeOut(200);
        });

        // 背景をクリックして閉じる
        $('#item-modal-overlay').on('click', function (e) {
            if (e.target === this) {
                $('#item-modal-overlay').fadeOut(200);
            }
        });

        // Escキーで閉じる
        $(document).on('keydown', function (e) {
            if ($('#item-modal-overlay').is(':visible')) {
                if (e.key === 'Escape') { $('#item-modal-overlay').fadeOut(200); }
                if (e.key === 'ArrowLeft') { $('#item-modal-prev').click(); }
                if (e.key === 'ArrowRight') { $('#item-modal-next').click(); }
            }
        });

    });
});