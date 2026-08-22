/* =========================================================
   韓国旅行ガイド

   script.js

   Part 1
   - 基本設定
   - DOM取得
   - ページ切替
   - ナビゲーション制御

========================================================= */


/* =========================================================
   DOM読み込み完了後に実行
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           DOM取得
        ================================================= */


        const pages =
            document.querySelectorAll(".page");


        const pageButtons =
            document.querySelectorAll(
                "[data-page]"
            );


        const navItems =
            document.querySelectorAll(
                ".nav-item"
            );





/* =================================================
   ページ切替関数

   data-page属性を利用して表示変更
================================================= */

function showPage(pageId, addHistory = true) {

    pages.forEach(
        (page) => {

            if (page.id === pageId) {

                page.classList.add(
                    "active-page"
                );

            } else {

                page.classList.remove(
                    "active-page"
                );

            }

        }
    );

    /* ブラウザの履歴にページを追加 */
    if (addHistory) {

        history.pushState(
            { page: pageId },
            "",
            "#" + pageId
        );

    }

}

/* =================================================
   ブラウザの「戻る」操作
================================================= */

window.addEventListener(
    "popstate",
    (event) => {

        const pageId =
            event.state?.page || "home";

        showPage(
            pageId,
            false
        );

    }
);

            /* ------------------------------
               ナビ状態更新
            ------------------------------ */

            navItems.forEach(
                (item) => {


                    if (
                        item.dataset.page === pageId
                    ) {

                        item.classList.add(
                            "active"
                        );

                    } else {

                        item.classList.remove(
                            "active"
                        );

                    }


                }
            );



            /* ------------------------------
               ページ上部へ移動
            ------------------------------ */

            window.scrollTo(
                {
                    top:0,
                    behavior:"smooth"
                }
            );


        }



        /* =================================================
           ページボタンイベント
        ================================================= */

        pageButtons.forEach(
            (button) => {


                button.addEventListener(
                    "click",
                    () => {


                        const target =
                            button.dataset.page;



                        if(target){

                            showPage(
                                target
                            );

                        }


                    }
                );


            }
        );



        /* =================================================
           初期ページ設定
        ================================================= */

        showPage(
            "home"
        );


    }
);

/* =================================================
   初期ページを履歴に登録
================================================= */

history.replaceState(
    { page: "home" },
    "",
    "#home"
);

/* =========================================================
   script.js

   Part 2
   - フレーズ検索
   - コピー機能
   - トースト通知

========================================================= */


/* =========================================================
   フレーズ検索
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const searchInput =
            document.getElementById(
                "phraseSearch"
            );


        const phraseCards =
            document.querySelectorAll(
                ".phrase-card"
            );



        /*
            日本語・韓国語・カタカナ
            すべてを対象に検索
        */

        if(searchInput){


            searchInput.addEventListener(
                "input",
                () => {


                    const keyword =
                        searchInput.value
                        .toLowerCase()
                        .trim();



                    phraseCards.forEach(
                        (card) => {


                            const text =
                                card.textContent
                                .toLowerCase();



                            if(
                                text.includes(keyword)
                                ||
                                keyword === ""
                            ){

                                card.style.display =
                                    "flex";


                            }else{


                                card.style.display =
                                    "none";


                            }


                        }
                    );


                }
            );


        }



    }
);




/* =========================================================
   コピー機能
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const copyButtons =
            document.querySelectorAll(
                ".copy-button"
            );



        copyButtons.forEach(
            (button) => {


                button.addEventListener(
                    "click",
                    async () => {


                        const text =
                            button.dataset.copy;



                        if(!text){

                            return;

                        }



                        try {


                            await navigator
                                .clipboard
                                .writeText(
                                    text
                                );



                            showToast(
                                "コピーしました"
                            );



                        } catch(error){


                            /*
                                Clipboard APIが
                                利用できない場合
                            */

                            fallbackCopy(
                                text
                            );


                        }


                    }
                );


            }
        );


    }
);




/* =========================================================
   コピー代替処理
========================================================= */

function fallbackCopy(text){


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    document.body.appendChild(
        textarea
    );


    textarea.select();



    try{


        document.execCommand(
            "copy"
        );


        showToast(
            "コピーしました"
        );


    }catch(error){


        showToast(
            "コピーできませんでした"
        );


    }



    textarea.remove();


}





/* =========================================================
   トースト表示
========================================================= */

function showToast(message){


    const toast =
        document.getElementById(
            "toast"
        );



    if(!toast){

        return;

    }



    const text =
        toast.querySelector(
            "span"
        );



    if(text){

        text.textContent =
            message;

    }



    toast.classList.add(
        "show"
    );



    setTimeout(
        () => {


            toast.classList.remove(
                "show"
            );


        },
        2000
    );


}

/* =========================================================
   script.js

   Part 3
   - Wanderlog iframe確認
   - フォールバック切替
   - モーダル制御
   - 初期化処理
   - エラー対策

========================================================= */


/* =========================================================
   Wanderlog埋め込み確認

   iframeが利用できない環境では
   自動的にリンクカードへ切替

========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const iframe =
            document.getElementById(
                "wanderlog-frame"
            );


        const wrapper =
            document.getElementById(
                "wanderlog-wrapper"
            );


        const fallback =
            document.getElementById(
                "wanderlog-fallback"
            );



        if(
            !iframe ||
            !wrapper ||
            !fallback
        ){

            return;

        }



        let loaded =
            false;



        /*
            iframe読み込み成功
        */

        iframe.addEventListener(
            "load",
            () => {


                loaded =
                    true;


            }
        );



        /*
            一定時間待機

            X-Frame-Options等で
            ブロックされた場合
            loadイベントが発生しないため
            フォールバック表示

        */

        setTimeout(
            () => {


                if(!loaded){


                    wrapper.classList.add(
                        "hidden"
                    );


                    fallback.classList.remove(
                        "hidden"
                    );


                }


            },
            4000
        );


    }
);





/* =========================================================
   モーダル制御

========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const modal =
            document.getElementById(
                "modal"
            );


        const closeButton =
            document.getElementById(
                "modalClose"
            );


        const overlay =
            document.querySelector(
                ".modal-overlay"
            );



        function closeModal(){


            if(!modal){

                return;

            }


            modal.classList.add(
                "hidden"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );


        }



        if(closeButton){

            closeButton.addEventListener(
                "click",
                closeModal
            );

        }



        if(overlay){

            overlay.addEventListener(
                "click",
                closeModal
            );

        }



        /*
            ESCキーで閉じる
            アクセシビリティ対応

        */

        document.addEventListener(
            "keydown",
            (event)=>{


                if(
                    event.key === "Escape"
                ){

                    closeModal();

                }


            }
        );


    }
);





/* =========================================================
   ページ状態保持

   ブラウザ戻る対応用

========================================================= */

window.addEventListener(
    "popstate",
    () => {


        const page =
            location.hash
            .replace(
                "#",
                ""
            );



        if(page){


            const target =
                document.getElementById(
                    page
                );


            if(target){


                document.querySelectorAll(
                    ".page"
                )
                .forEach(
                    (item)=>{

                        item.classList.remove(
                            "active-page"
                        );

                    }
                );



                target.classList.add(
                    "active-page"
                );


            }


        }


    }
);





/* =========================================================
   外部リンク安全設定

   target="_blank"の安全対策

========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        document
        .querySelectorAll(
            'a[target="_blank"]'
        )
        .forEach(
            (link)=>{


                link.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );


            }
        );


    }
);





/* =========================================================
   画像遅延読み込み対応

========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const images =
            document.querySelectorAll(
                "img"
            );



        images.forEach(
            (image)=>{


                image.loading =
                    "lazy";


            }
        );


    }
);





/* =========================================================
   JavaScript END

   韓国旅行ガイド
   script.js 完成

========================================================= */
