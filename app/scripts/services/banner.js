/* http://stackoverflow.com/questions/13762228/confused-about-service-vs-factory */
define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.services.Banner', [])
        .service('Banner', function Banner() {
            // AngularJS will instantiate a singleton by calling "new" on this function
            this.dummy = function() {
                return {
                    background: {
                        attrs: {
                            x: 0,
                            y: 0,
                            w: 810,
                            h: 380
                        },
                        image: "http://placehold.it/810x380"
                    },
                    fb: {
                        attrs: {
                            x: 603,
                            y: 5,
                            w: 207,
                            h: 54
                        },
                        transform: {
                            /*
                            "x": 603,
                            "y": 5,
                            "size": {
                                "x": 207,
                                "y": 54
                            },
                            "center": {
                                "x": 706.5,
                                "y": 32
                            },
                            "rotate": 11.052011093014322,
                            "scale": {
                                "x": 1.4732544930284932,
                                "y": 1.4732544930284932
                            },
                            "translate": {
                                "x": -164,
                                "y": 103
                            },
                            "ratio": 1
                            */
                        },
                        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM8AAAA2CAYAAABgHM2OAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzJFODk2ODcyQkRDMTFFM0FBNkRERDQxOTFDOTAwNEEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzJFODk2ODgyQkRDMTFFM0FBNkRERDQxOTFDOTAwNEEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMkU4OTY4NTJCREMxMUUzQUE2RERENDE5MUM5MDA0QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMkU4OTY4NjJCREMxMUUzQUE2RERENDE5MUM5MDA0QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Po8g96gAAEu+SURBVHja7L3Zkl3nlSa29nimnJEYCWIUCM4iNVASS10luVtR1e1wuPvCDod95WewX6CfwLe+9a37wh3htqOq24qqaqlLE0VKpAiCBEBMxJjI+Yx7+r2+b629E+oIh1SOqjscRjKR5+yz9z+s8VvDH/3VVgiP7j6SKIoljRKpmlr/HfGH/44jkUZkVhXSSzJJk1j0HQlN0M8bydJEQhAp65rv2//0K6Hh7zxO9T1/U4K+HySOY7t/XUnURN138H7Q//h8/a+9Bz/T94qqkoV+Z5j3dKwx369Drc+P+IiiKqWX5dLUDe+DZyV6XZIkUuv4Sr1fzMHb/aZlKf0s4+MTfTbeHxcLGfV6HFsSJ4LJpUnKtUh0fSQKUmNdMD79D79jfUYIgWuIMWA9cl2XRtdnps/AvLI44nhyXcNC743re/rsVNenqEuOB89blPrcRO+p18ch5vOwzo0+s9Y1z9OU98FYU/xbPwt+DVYk03tgTLXOtcZaC+5rz+Z66XUYw1yfmem45rqmeK+Pe0ngPTBf/BtrFuucS722n+Ycsy61/m6MXvT7C52vjlS/k+i9Co4Lj2oCyUbnhrELv4u1j3SsmV6b6HxLvYi0o/cDPWH+mHcJutD/cM9uv/TvLI2ll8b8TkuHpY6/4N7oZ5ler/9x7r5fwb+Pi4uy0PXLuj3DHKtQKb0YnaTY79joFPfFNaRVX0/QBNYu0WfP9V7pnV2R3XHFzWuahU6o7ogLX1zoRcpBMsh106s5NyvXxSXz6IMxuzzJSej4LOUCxOIcpu8XfCg2GpOuSp1U6oSPhdX/MHBcj2fOi4KLOMhzMt1MiZmbqAMeZj1uxM5sJlgmEFml48BzIx30vNBN7teceKZjbBkaBAeCBaNIcOaWwA2cVA0Zo6qw2Pbx0/GhLA+GOr+SY0z0NxZM9HcVjClBONzk2BYdS1w1hTMZ5mMMAuLq6YZh08Cg8+lCDjF+JYw0qUgMEBaLquLnmCvGnut6l3UhtY4PAihEDe8lshBjCXthHIHyJ+J8FuVMItw7hnBqeO8kMoLDv8GMSdSYEIts7tjLfk+UICquZV+XCc/CvxsSaqKMttC/9btc14pCs+FaNGRyJTcKMDwX+0hGw+cYcVFxz0v9jb0A05CZI6PVsm58TcUEFhgAe1QHMnYUTJA288BnQ0DmOiYIUzyUohKCXNcp0k2cLhZcn6EKQTAA1gHzyZKYTAdhlYjNC4IXf3NuMYmQ3J+rsKgqmxNuVip9pPy+fc61BxnNFjMdUI+MA2lU20r7RbipEkFhN4JkqBpjtlGvzwnie7FLN3B8gDbAolW2WFiA1AmujrBpJjmpCbBgiTETNgtaBfcAIwx6GceDRaj1Xrg/pBsXSe8BKY1B4ZqZXo9FnEynJPw0TbgxYGTcr5+YxAGxQCuASEGEQecCaZ31YhJRoYu0qt9fQBsE4b3BjPis1s9A1JUSATbXtG6gcAgdUyVcZPyNzcXfIAiMAVKxl+mSS5+fYdqVjgMaaAgNiMXQ9ZqpAKlrWAJiEi9UFFjQiJgDBAGIic9uKjImCMSkYyMjFTwphWEwIgcRkphrChAQK/YCRAaCgSbAliSRCRVsTkYpHHPvoMWx1rjHSAcNIuReVxXHXpRgppRzWUADOvPEeg9qBn1/oNf18rizKLDXZmkYdYLxqa3qhkK3bMxKaLU/LKCyLDlW7OucGt21alU7o4LOEq5loLVyZAlkfBYYeaF0lVNIYx0pGHSN5otCxzjgPk2gMFQYVHie3ovaW4Rrm8QNBS0ZCURqJkfEhYKoyFNTaY2+11MOBJklsL6US7EYeCCIE8wBqRqDUPRBYBS8DykAIhxAQuh7OiNVrQ0JJlPigSTEAi71M76HTY5pKpr6h1Q+nM8pLbAANSUQCEEodTDWUjcMRACCgsQe9hMuJAgIEi6qlVECtIaQKCMSU8M51iHmvA5nUz4Pi5EpwU31ma05FbBQkD5KcBgPmHOQGQMmNJ1q3TTX0D527BI0ZKHX4ndCojZNhI3GXPGDf2NM0DApzZTaTKXGJCsIBgQXaK4Fri+IqxVINHGSiGuC9cb4YjJ5reuQkegmOgZ8B2PJdc0SJQoQ58L3D+MyQdl0z9Ov8994JpieZlw7H/0bjAeiA+NBCBlx1lznWH8KHzs+A6PlYub0qN83U44CsqagjFwb8hl6P5qsem/QBecThW5OQjrMlOh7vI76DMLHBSLulcVRZ5Zin2HGmqkIbax7p6oVDGJCOpjgh9lWu6UlMYVWlrnVg/f0mbg2ammWJm5wjUvTEQRvZgUWFR9O5zNOnhLJ/YFEJS4GFuMaEAzsRiy6EjEWC1KKJk1Rc3KBmx1xU/B9+gW0JdWsUnYsad5Exgx635KaxcwPjHxZFxz3jt2UaQk0KEPRB9C/sZlxqxkoGUwLkVHc34HGhPRIVYyDELLIbDOMOdPFxwKmWcJN5TyThNIv1XEtKjdndUOhrTIsZqABb+YcNBcYAZqmNhMtaWJq0uASlowOWzlK+T0bF55hkk0Hx+eAAOFzkmghzGgWt2aLaSgwrbjGSeOeSvKE0pjMr8yn7ERCoXkKc5VapnbNoMzdxCTEKLQmSirT6UyfM6egoy8jrk3BHBAa84VpcRdi9AF1HLqipmnwPJXkkPC4d+E+Xs+fjTXlZyE6ui92GPuEcdB8dc0MCR2MKfFMCK6GfnPCPQNtVmrK0ofMbbxmSto9AgQEiB17SCsp4XgwjkzfhwUDGoK/QpNe79Pob5iAfWWuioLJfS6dS5rpGBvhPVJ/BoR25ZZVao6SLuJiTqIE+Y76A+NYOOg6cUhHaB3xgeLhkXNf5OoRs4OZE1MC6KLrNXqVaaZYOkKCtAEzpO4cwuThhPUzSPZAv2fBjQFDgxFBjJg0nWn93af/VVJakziwEHpjSCahY5mZ5KFDb88LJLyI5h7dT1oLjTEmPCaOz0ycKsJ7gQs0V9Om3+t3ZhjepWR0UwebXpY1Bc3ycIkLTZ8mtnGa2aVP9DmCiCcqnGCegrgrmlBGiJGaBIWDDX0ljmZe8Hm9nmmwTOceZQnnTqanU512VkNZB5oTFHy6vrNFYWut60GzVp+1NBzKtJh3vimeA9MP9zSpbhY79gS+AEEa3cuVwRI1Cz4Es2LfsLEw1zDnjOa5fpyar2wWfzAgRoz5MWZc17oEIN4kMp+Vkh5EX8HiAbhjxA3LAmvMeSQxtWPs86VAoT9m5iUtJ9csMQEpcyfWl5b575oWktEWBbxeBwsEu1rrmmSwsuA7ZebTT2aFAU66Z5gjBEzCfTfAIcUimJNuBAWHCA+BCgX3LyvhGMdXlDKwDyEhYYNjCMFtZfpE+pltpKFCuD6ovb4owEQp/R1sEDi9EXMWW/Vq/syR1MJ3J0q4KTcoIXEnsfsStdnYwW1nagwwnV4PxsECQErPdfKwlfu6GNAU4GtbUFPvSWSMhoVqXOfRhKKkjThOCeZLpA5egLBpBvrYa/pptugQQBjX+mhEhja/6gh5M+QmEPgQIlEmKSl4HOHMItO0gZIp0IzATTI3tUJjgoT+GxxhJQZ8D+udO+OYtjTCSZKc5h/WNMp1DjpGCKXShZaZijWl8kTNVviLu+OJmtR9jnd5MKAgLJuKwrQGAKLzzYjIGeoWBZh2lUn4JDJ0TZ8d3FQ2P0Y4BgOKKgoyMGETmz8BTY09ghavuS5Cn4+CAt5EMLMSWg8bGFNAxNwfA3siCY3jQQ54GQiV2FxJp7GZaSL08fGZ8L41zU+lcmryPtDcNOaeQ7CEyhE3MbMagoe/h4OMF1YqteisB0NgYjjVtFBqIiz4ej83hANOb3CJDjSo0e//fa+nTQwns6odxDZ8E4tD66CRzsxZFEdMFRyyrpvSEBYlBGzkTCUHTJ+6LE2NCxCknjm20BAOXmBsrRo2aVVz4+g4+ntV1RAkCbTPIwIFMDMGSlDYyKLVVpEhSqXPAZoI2rcItYMTxqAVUSFDu2BbE4xwRx3mk0GnDp/hdxO77R5IZFke815AFrGFBj03NDkIVQfCh5y3RAa8JImHEFofy21/aofa1hWOf+X+DQh/eTjiM1dUO9XBEDCYalmcmTMOTdUfUpjxOcEkcgsdQ/OXlZlJxhxq/uiax9wP2CMG2IDW4LRHTsg0g6GJxJ5X+ZibJnKTDJfAT67MtHI8C3QQObQeJ2ZatuENrFfqviCFuBhcPlIax3vj6UQqtQAGy6v6XaUht6wYIojNzwOt4CcEs8iaxlA4QN4Eh4rKtAc1A9Uj/JWY2gMmV4uP094D8XMTIxJsi5+ruCBj/H2uB8eXlTl2eWZmC56ZNMFNjYTLbfayfQ0IS+QQY+F+DjQLNFFFqDFt94K2K516oEyVuClXOZZktgn9Jfg6uvFt/CQ4hEq/Q6RzDmMxwITj4UMMDsdmQ2CQoGjfVzQDoJkxzhZFxPKnwdCzlokgSCKHZ8GAlTvTsWtYaBa8JnPTtBAGk9mU65I6Yog5AwHEpNq1aoUO7wNUsjJ0DkyauxbGJGG7wx+MggEP5gvC39Oxh9YPNX9qPi9p4hn8XnksL1DI9fLUCRdmY2Z7AZ8h73cWA5lCLP5T0cc1M6z2MIMho+ZLZ3lKjWams8eAyIBqftaFa7jUgRjTJo3TcHCwoAU+6sjmSgZwP7zU37d+83N5cv1jufSdH8qpK2/yelhQsfs89L4dpInEkLrE17ONr6XA4Au12aPMuJawcmxBKU6sDXq2vkMIHgQzmxW/KzXx8jj5e11PSetmU+mbDnOCKpuOUUPGYMCUUjqjlIO/BSKCvwD0ZDY38xKTz1rzCH5ZYebFZHJI1CujNApUxWByMFzsgVFqRIAHMG9AII3FJ7BYphlhHtUGWGAzazOpsGlz1XgjldhgbPpp0I6QpHFNRIxrG5mWCb4hvbzHayvEGxDIo9lg0pFawkVrQhPGNAAWrKSkjTkuSFMjNDNx21ggbfbYzOfGQm3GqHVw8McEDmyDNDUCYzATjjAD0H2ijr3ckazENhR/Bw+SEZ2DhtHx9NMebDTVpjV9Y4Y5Yhs35CUEQLUws2gIYKEsPaZoIBMNNuyvC7SGprW5AjGD9g3jWAY+qMmf98jQYBwwEGD8UBu9MrDb2L7EbXC8aeizQfgkcDn0+19+/Gv54Kc/kWh+qOP9G8Yxz7/2Fq/FfqVpS0umEQESwA9ivKc03y036waSPzEMO4m4+QbnmkOWkihTOpyU0tyK2MwFLCTRJL0+jv5e1xOligMXCESZxC3zGupCooEjnhnOD5sbqFiIMjdNTEt0BCdGXITM85yEAkwfEinzjIeUgc7IHUr38dx0BANZIC0hQZtdbojdtCrsurr2jTFmZlxKzZh23pSQYtIJVBAR6DAzGHY/0D6CKonFiLAB5vM1TpSmASt3fC34aVqkcoiaAVTdo+l8ITMwHHzvxtBNQ9zMF8LEo9gcW2y8AQKGRFpYAeCIBShhVs8Z2zCBCTM1yswvyuPcNGK75iDQymI5sViAERqMQs81SZxYuAI+JwUQA6+5ESMtjbyLC1KyOsIo/nkam1/XxgEZ6EScCaY3wwjQKMqQTUGBPOyZMCp975M6tfG4pqNPTe0fy72b1+WLX/6tvPz6OyKbl6W5/1u5+bMfS7GY8b0MzOn+IOip9DhcGx9rzemKFhBRl8TRCONgDLwNhLaxCaJCdKQTIw4E8CrDyAFVYqH/2Osh3UumdSjBq/bAYme9jCAFTQdg+JExYdMOOJjpQmQvuMPvAa7KHW98hMVrJfJkvrDYk8PPlNiedsHb0JxLDfJ1ZqGPQFCg9a0saQW2Lk0rfdbqaEnGs5lBpkqwi8VChst9bqTFyhpPcbK4FeZaEwROqPEiJcZB1KNUg8ZKiD6ZAIDQKNo0ELBOAt+qJjNaADah9MMaJknikHtCbbPgZlcMImOOnKs0nQkHoiRIQcFoUh7MAPQv8Xvjc8C2nDWhfovrYF7m8wWa5dBI9CkhrR2SbrMYmCCUJO68W9ysRd2GiK+40EPaD03bFsJ35KyN5dSFMSKoEpZNSTPRYk8EGwAqxNL5XQxh6F7EHnAFOktNr+MEU+w/fSI3f/HX8kyW5XvvfEea4ZrcGaif9+Uv5fYHP5FShe3r7/2pupy613qfuoUeneZmeA9754H8FM4b4Fk6y7qoDIIlCTevYgDTpCQYDINqHe3G1SMWhkjRc9dT7UXmDD9/PQiz58TdMIUnJnTMtJz5whgiNjMGcDGcu6I0dA0SnXBuZNI3TmKXykKTgFI7yQ1iL4AOLTgnZnx5ABPmDaV6hEh07LawEVDjYAV8pSmlsMVCIs9LM+vbiANmTcs4BTIe3GdrJZXlnRkSFCitj7QCTSf4fBJ1PlZF8CRjnh4zAWogjwsG9hivSU3LlR5LwU/tfgcIHExNiBhahgCK+YRR1OaHmbkM6LVmloGhg8iTSN2UzmILBRisXBH8ACIVRZYaBU4rdF0BygwyYy5YFsgxTDwvjxrPYyAtCGMpQmZmAhYOseVFWi5fTK0bGC6JyAjUTnVpRJ+l1Nypqus0T5knB9N7UVqeGU1TYDGJo6MI3CsDIF+vg8ShIcAgi7l8+B//gwq6Rt587335ap7KKytBLrx0Uu5E31Xz80O5p34QYm+vf/cHNO8AKIi7HwuxsErmaWYQdimDTKnh2pEnQRLFoXSOJelSOuUIr2/qLmqPAVKLxAYhRp6MKA59gzlLT18hVtRA2i5ofzLnzB08EXPqWycN188WlhKUeLIjxgbzJKEGsnyjxqUdzQ1At25i0LRAEqGPEYywqKXDMo1pzDSNfIIWb4pJmHj+cHmpAzngQ0Uco2lNwJkmTFLOCdFpfN7GmhrGfyo65HDqwWwQQKnPx3Emj484cECMUCU1gQ8LKDLXrGfZB8HjMAwISsLNrLoMjcZN2IS5Y5XHWEwbBmNbCAHPFws0WXMP/qVcSwgB+AfQ0v2s77EwGzfnqEIDRIzk3A5cgplfu2jxHLvY0TsSW5zx7yzzVJ/ahCislciFV+S+YO25eBYQtgA8s0Z0beZiY8ZjLAXM9gwCIPJgaQrwwwUIg6y0IlJqlM9++ldSjXdEzn9LVk+ckRUdy7UHB/Lq6WW5eOa43I6+JUt67YPffUBhcPW9H6gGHigzzrlPCIPAdBzkBuHj3qRCLFjr2EcO1ZlqNXUPQu05rMmcrMQgREs4NBSjvR6bASnDABoRt+D5ZKlFyjvGSyyHi5tf0xEsKjMpABGnjOYHxg+gGeEfNa4lSpeqJtU9UzdOOj8N6RVwJEGgs9mcZgQ2g8GvyPw5JEFS90SWi8ZNo29RWkyAoINBodQ2s4UsDweWfvRchrIhOJY5bImsJYVPXxcZ/ho2GmZOHPdpgEOYwEyiFs4Sajv6BTDXlOGLwuI22Lj2Bai+8rSTJjKnmBkVgG6xocqwNOc8U8MynwN9EcDulcebgIoxvhHbHpWzhcWhMhsDIXAdx7A34DX7kzG1Qs6UqZi+KBBSxJa6+FtjkHEqxoQNIOqisrkXGHNp2RP6/dKzD+jzqrluGSKm1bEuDH5CgxPiVw2aRc5gNvc2pSdxjQ8C7sOUDM/5jYlFjYhEgonygXz10d/ItU+vyde+8Sdy/rXX5dbWWC5sDOXS8ZF8/uhAXjmlDHT6mGqgd2Vdv/Pg019zzd/6/j+VpaUVmU4OHUzqdaZp7OEQNZl0Iv3cla24NK09YJRSq5hJFcmSSowFTRNPtXD1q2tKcylPM5dUtcz0odV8ompV77FxQt+zCD0Ia66fTfeeSW+4LKk63fPxvkqGA0lUxabqU5BY9Luz/V1JdNC9ob43mUil6pf5WFFCc6JRYs+HK5Iur3UOMRIemRqk92zGe0pgBe+xGKxIb7Si0q+S2c4Twsnx0pLkq5sqncYy39/B6kt/eV0KJZzpYuJJlAml4mGhBK2bsTwaUlJTm3HOSowH29RIEEQMto6W9dIV5kVBWMCBnupY5pgjIU81KXXMZdSYQ6wMMd7bkmZ6wLyuRtcoVZs8081rEBWfHOgYCzNXI0uSJJMtrUqkxA4ix/fK+SHXCISFdYo9PhHBJNQxjVaPqUCZSXW4K6GYWPwn1fVd2SThwbejiQghBwLV8U50vGvHT5FZZts7EitDJMurkg02ZK73KQ70XjqGJoOpM2UOWHrylJo1pcx0D5hjpuu2sn5cFvr5YveZRLqfYXWV/gzRSc/wgLYbMj4njhYe5cI17huJtClQ0pn6rc/MLG/3m/rDkdz+5Nfy6Ue/ltff/YbMjl1QkzzIKyeX5PqjQ7m4OZBLJ5SBHo/l6qkluXB6QxnoLVnR7z/54jcUgm//kz+nCdcw8yB3TW/KIvpfPqnCzsP7R5Ff517WQ8SWGdAYUtplkzIFJrFctmCAP2tj2tgQkXtd+JezmZwb1rJbpfLJZGCpPIw8J3I8mckbo7lsLVK5MU7lWK+WV5dqtUUT+WKSyVS58XI2kVc2EtlphnLrsJaXe6Vs5oHOd+y54v24kZuzntwvcppA8/mcfkM9HcvZbC7vXToua0sD2R1P5aefPZCn6YYsjQbyRn8iq2oOPS5S+XwxkmPxTK4OFmr2idwoluREWsnpfK5EFBE2jXQz7m7tyJ193czVU5R4WC9Iwb4aD6/2x5Y5ESqaaXuTmdx4NpVpf1MGYJJyLhd0Pc72SwblxmUkNxYD2atg6Kumno/lYm8u75w7Lis63r3DiXxwe1tul0M5vTaSC/lMlvPIEo6CF1XoPO/Pc3nSDIReYb2Ql9OJnO57BoxFZim9e+q73C76cmusknn/iXzz9ECunFljcuW1u4/l149nEkbHJO/ZvMCkZ/Q+F/R+01rHWkAbZXI+OdC9EvmqGsj1SV/nNJZLw0qezSPRLZJTPUDlIp/MR7IRlzrfCqnS8nBcy71kU131he77THbLVO4u4ANllgTq0Lql3liNVptXKEfWNn83jWXiWxD4qI4MWlc8EXi0vCKP79yS2z//K9kOqlm++X05d2ZTrj/Yl5MrfVkepGSgC8eGtKRuPZ3K1dNLMte53nm8K/2n12Tr+ody8srX5ep3f2i5nVVB6wlMNENSMY0tL+RiNFUsOIcs2STtMSJtULBYljDjCJ4+7ukplApVQ/QFm7VAerdO7uqZDfnBayfl9m4hn37w1P0ToWlz/sKG/OitE3LjwY48urYtb1w6JT+8vCq/vbMtX3y8JbES25++fVq+fumM/PWNXbk325ZvXTkhb5xeFQYQupcS961dXagxkxiZl6UK9dWNVP6rt1+T0yc2uitfeemE/G8/uS4HVSZ/9tYlOb0+kp/cfCY//2RPzh/P5M+/dV6JfiFffvRM3rh4Rt47O7QESu5OLBPVfNfubcm/vXGoazIUKGCsmVoX8l+8dVHWV5e9mErXQzXQrUc78pfXn8pnB2NZ7yfy1vmT8v6VY9zgh3tzuf/RY5lNaxnFtVxdjeVffvtNvcdKN97zJ7fkf//oIc2z918/Jy9v+mfPFRf+1bUteXx/ytSmoe7sm+dOyPuX9BmpZYaLx8owif/n5r7O7Yb8l2+dke9ePUtEEq+3L56WU7+5KT9+bL4STDto0KWlZfnzr1+Qw3kp935xXxo1nb95+aRcfem4/PTOvvzsgyc6nyX5F2+fkg/v78udZ/vyz147Q+j5k5/ekZOrffkX775MYOf6w135X3/1WC6+fEL+4puXaTrd/+1jmXuCsAllQ/jE06caF+Shka7+B39EhsU4dC7uJ5u/Ti00GEozO5DPf/m3sj+P5ds/fF+2VAA/3JnJa+rjXHt8qAK4J6+fXpHP1Gw7rwz0tRNDNeEOTQOdWpN78oac0AduqQaCKwMGgo84V6Zh+AMmJ/wG2HddcNK5H6ZacKiuLCzlArYu1BZs0sp9JIuXRBYH8dqPyGsnWJ/iDmPj9zfHObYcJWgwDAKVk2SImJm+sFqvHstVpa7KVO3m36panejvJTCnSsqdaSW/ezSRjx9OKN0fHiwMugzme8zGh/Inr50j4zw6mMvf3NqTx/r75Oa6/OCNc+b04XlIaU8szkSIFc49HMzSivywcdOykc+fzOX29lRGo5F869VzcmU143yYR0cEDLcywOTZWMf2ZKoMGsuVc6fkmxeOSVxM1WeMZKVvWRPIsBio1huhVEPXdmXYl/dffYmMc2d7Iv/+82dyVwXO2VPH5evnNyWChmP2hpoTk1o+US3xxdZCiUA198yD0pUlcT5dJPLxM0j6iiYo9uj+7kxu7szl5vZcHeQV+caVMxzrT27tyG+/UnM5SuUH716RjX7q0H5MDbczV/MrzyyXjUV0Istw9PW+A2WkRDUdfQwkniKHDJkkQFNR+OdlGAR39O/TG8uyFlfUhrEXVzL+UlvRGwEGz7NDoLJsK1AtZMVXyURlg6hbWJ6M45kDILoEz1dh85uf/FjNxrmcePUb8qxZInPAh/1KhRaY5tlBoXRUyGtnluWu7i1888tuwvV1oueVgRYn3pDNV96R7VufyJcf/p2lfnlyKEIwKRzyFjUDFNkyArOMa8O4wSgRnDyqy8hS05HtTPgbAVCDaCEpenFGadzowhYOfbYokDiKZsHGpkPv4M7Wrp6nqrWSSk26MydlWf2Rn325IzefTeTEMHeB28inD/bk//j4CUsjlgd9MjMzC7BhygCnlivZWDaH+4Mvt+RnD+cyGffkL958SS6p9skfPSI4AVi1qa2yFeZLKG0D4WSDgUB4t1WF/9vrezLTqfxPPzgvq4NMXl7vyxcPqg6CHaUGyUIAfXjnmfzlnZn86PKK/PPXjsup1SU5s3qgRBnJ2iAxzV7W3KDjA2hsBGCX5GVl9Fql/cf3d+Q/3J7JwSLIefURTq6OZHN4aCaJvn5+d181yLas9c03sTSjxJNfK/nFvX359zf25L3zq/LfvH1C/caZ/PjTR6LKUp5OGvnv3zkmo35P7jzclr/R+6S6BmdWe3J8uS9nlnPZUqasUG4PIVIFmS9KUvBynshEnfilvgnVPAkyUn4GiAKQYH+hBF07hK4SmsFGabqSbZj5lzbU13XhHBrzx+rghF81Hh5wwYsYIDPFxUta3C+S2Av2PHUKPkhklhHSh2Cy3/vo7+T+7VsyvPC2fOPqK/Jgr6BWubA5ki+Vlh6oMAEDXXt8wDu9dkb/jc83BqqFRroH+/SFVldG8rB4RdIzC7n58a9UkNby2je/J7kKURRdpkWbXOj/EfKjdDBkyvoBJCQo2qOV2aM5sntTyxIIjJFY2vxCFxvmnnQJI+LQrVhJd25pD3B4jwyv+LnmB7X6OalcPbkic5X6nz6dqf9jmdHipQ/wrQTIB5IsG4t0W4BRGVGv2exZgR4zlytkO6vmLK2wiaiPB0TFETtoLUbzYx+Jw+yGqOG6VPb1OcTngt2jRchom3uWNQN/eq/Dha5DSDoTC7lnSz2V1spkO4dzgg/HRj1Z6SViRbQRUTxooemikrH+zL19Q48ZvrlnX6trpAS90LWfNwSFJfcYFqt8vR4LhXCLqukSbrkGhflAqJ9q52XB7KqzOHQ4FuwOlmZTqD8JU3jUz7BtMsW+56lfG8tSGtG/wbf3Z7WOvbbqWDGaCAaPktgBPJ1VM/l3e16RHBmy12bmt1nQbWAyeAaJtHVRdHhi36OYPpmKOp1n4fU/qiH7SuxffibXP/5YLr9yVdKzV3S91cc62ZfbW5Ucqh/6ztll1baHcm93Kq+r1rn28IB7/pr6O9dV67yuZtufXl5TU7WSP7mwIvdVYxWX1iXVn+2x+sSTQ1otzLVjQwTEAuh4xV3soEf83ni89ugtofXKzS81NTLvzsDU7sbKcpmYh4YK6gRHIe20TQtGgFBZbexJk4z9VEe6ua8b8u7Fk3J8fUV+ee9Q7u54sJNwpGU57+/vy9aDr9hcY2NtVdY3jllaiPtbZXLkEQEh6meJuUmRwZ7l4jnGjSwVhFWbTkTR8x4Vgovq6xzuz3SzT7KEuo5Vgi52aEpZGo/5ilE4ctRbscHcMV1HVTqU1g8OC2YkHF/K1YzLKJEtJhK6wkNce/fpnvz4Win398AIgUFEvPZ2tuTujVuysTTgvNfX1inhEf1GdgVg51EerDeCJ5myeldKKyX3dQZ0n7RNNnzGLOFWf2FWWCqM/pLDGbT4UI7p86aLVAaDAecGs/PUUkrzDUHtaeGpQi7IGMqIjXH2x3NZVWEBn+3DBw/122e5Qmx0EqzgMjwna0P9HEN5kqxI2wKgYeA0eOY6MyNiS5QFPayoZvz+e9+Ql85fkpdObcpTFVa5juPrJ48p8ZfyoZqplzcHaoYv5O4zaKBl9XsOSeOX13MplTm+9845mq943qVjiGOuSu+tl9QFKOQ393flQLXOklo8qdWBP9eQQ4kBOUW5p1fYgounw9tmpME0UhyizixjTlKadsVhlv7/XFYxS5QThx6NYFvGKlE455ronC4wSol3xjP5Tzefyu68JOIHhrYkzVjOqpnxzeOAV0Qmg1R2GjO3Mk96bBfbnl3RrAleN2MfRe50W88Fah4vBGxz5Oq27kM3eFDuysW8kn5sG3j7sGZazRLiCFnecgwJYDKeyOM7t6V8Cd/esCwG/QHiB4j7YGtPxrOSWvT0sWW1/Q+8pMGlta7vak8FxJOH8n99paZvOpTLpzcdXRS5tBzLd4/DXFKTqlfLGAFo72TDOSSmoWtf8xCshgqNWOb0bSvXPJZRHXumOYkzsZ4D+A4YEfGrJ/tTOtAoWkP0vq31ZSyLWSAW65uptsyio+YYBkRZgc2e7uVUOXFzqS/nluIj0APxxCp05RzMyPB723hiVtRahrV0GSFEA1mklnTlB7UKzbma+6eOn5Erb7zC9UIx4JKalchI2C4iGS73ZHxwn2DN6yqgP3+oGmgbIALMtoma5gdyZaWRX3w1psAyrSfWywCxNCDPsRUqIik5hWMGiQPplDJlpk/GqLzct3YnjpaSfjzMM6pIMwsM5WDCnLdDYqq2EhTwgNq3pc0awCAQDQ5J7lvguVBJa5KJHFMbH69n+0pkk7ESdmp5XGm7L0G+efUcf/D6xYOJ/JsPv/IsCaslouHQOpml+VdxZFnCzDbIupsZlBu3GRHB62NCR1AvKTP/t+9dllXdhCX1FX71+Vdya6f0kuxgPmG72fpv2M1/fnEgb59a5nsHuglPx4W8m1nZ8xM1I3YPplwzQ7va5NaYPuNEteLptYH88PVLdNBv7BQq8RZMTcHrR996lT94/fX1x/J/f7Gn65kx8wHB2ALdikJwM8+IravviYpOuwYvp66hMdrZRlZ0BqayFmRqFgcjoI1RLoO9A1tTBFJVm68PrNZmVtT0jdI0OLLXannPStF7bO1X8uaZnjruS51gs9qd5ghA5LhNkFimS+PFhF5qT1PP9hYZC6WHCiA04KNiG7fVPj14MCYjTmczVukyz5BB3kQurqdy7Vkpnz8+lFdPjeTzJ2O5tzOTq/rvmzeeyK7SzvIagug1raG8l9MVaHR+lmFt7c2Y8wc7G2+kTKXXDUXlYdL6QdaqqO3TVnuvrao0CT6vvJ6fWQFmtyPOgth+T826qFXDHvEVT5ScFFUHELSFRq0Z175Org3lynpPnqntqcpH6jy4tgqyMylka1zS94Dz19TusQH3b6xHQtMxbsxcqdZnsOxlZ9ZgznbclR9HHRPEro1HOo+r5890BDedzWV2oGo+6Umvl7qGsp4F0Erffu08f/CC3fwbZW6YZCf6McuxD+pMDkLOWFUfJcIpeuJVnkKj41dCHCmjvvW10zbY/r7O91FnTD5Vs+/ZpKDJ/GQc6KxbFk3iQI3l1lnpunTpLlY92XfhIp1Ubaqj3niN13YVntEAgbI/LbnmJ1aHsrkzoZbcPZyp5uvJ2qhPcxLw/v5kLsureXevEKLOm4XP9dl2Ke9dXJPzJ1a77AyYr6VnFli3G++X0WZ8lJZhT2BAjvL52mphYzJrEYDvM3+QYZO2bNsYZ+EVxkA5gbi9spnLjWkg4yBgemNrqj7RhEHTuFrwHsNBztKZCmlZXjEQCksvqtX8HvQHKG+x3mxplTMbt5bWPLPiKJa8JMGLoAKbAvaU0OFEIpGQke2uQ01CGDNpc5a8OI3ZxWnutR5cuk6yMwm0MaSutbsRVxiqmnvtpVX5ZHtbdtXMCcMjJ/76owP56y/NcZuzDgUaR5gNHcN9oh9yxJz0aerGC91as6414zzG9Rw07/VkfD3YPpRf3D+UE6ryv3NhXf70na/JJ08+lhuTVqobNN8y15ba2I8njYznhdxUDfXFs7mcW8vlxCBhrt7nt+/J/d2J/Ku3N9Vn6MsZ9RtuH5Y0O0F6I/Xaf6e2+E9v78n3ldhqd5ojl0QfqFT96a09lfy6HyEmqgXiWNSW6o+fPWg2Epr3BkBuIFom1daLTVwYtkWBrRXQFuCx0jbr0Q84LKPOfD02UGZSgfBEGXhjRX0uZR6AIAfotRAbNN0uHLRgnVvTTLWaCPXP1bQ7vr585E+ysWN01ObMe6RZjlvrAlk7MGsWYmlE3KOy9i5G4lB18F4Kmflbnk3fmuBp0qZBBbn5lZrhl9fl0WEl1x9P5NUzS3JdfaFbutffunhMiti6JQk1dsp1g1IA8JN5Ui1zAoMng1qpsfktba0LyYjEpjZzopuj7+XIJk0jT8FhMQnt/34Pva/m1iDB63fqVqp5o4O4iTmQNl2FC9j5RSYdbz3Zl2tPpvKdyyfkldPr8tKtbbk/QX+EJaud0jHBfn461UVBciMwMF8sdnih4x51kjqmRA5U212Vs+fhcW6RMWzZVohK+L1cqW0lxJ/d3WckHPDmal9Uxa/Kg4dmzkJre1iIc/7NnS35P29MmPg4UWEDSHqQYo0DtcXrxxLZRM8vMYSsl3ldvhXeM9Xn/t5EPnk0JvNETtTtfPbVgX86a2Q1xEx3inysLB1PLJlyPB6r9uhJ+7U49kzs5+YVex80ec5ExXhAHIB+a6TzKwPt1AkJdKRa9uLxVdmbQvMtSDxnjq3IQE1gONI1s+gtEdeYsLSYlgtjMOKXW4fyxsvHOu3OngJN3TEws79r64CK9KuE3T2DhyGOQI2WsYL32mi8sxDihdQMns3e5sMNB0OubcW8PQY35drDfXnnwnG582wsN5SBLmz05NFY591fpom8AC17Qiubr8Bdca1tZRxTaJ6IJptJXstZC54iYWga4EHkOVknGhSkgTlg97IJRsluD91kWAMyX0jSSwhjtyr6cG/fSm8ByTI8sebSxzWWb+CTg7l8qsxz4cRCzrzUl7fUd/hEiWnRmRcxfRt0O5mp9KnRdEMXZHl5VQlnrkNJJRv2u7iS1WEU0iLjLVu1m4EebxO1jctyaHN3eLX1wWBCoL/cl8+mTIpEDWbkaSPmN2RdqYGZsoFm1ek8VWFjvtay+kojHSPg2v/uz962QUUpYxSrah70poYiSmjRMIQLmm592kYaXEvV/IuZ+oKRVWXiub1+z7vaVHSmzefMOxTREiUbD05nHhGomXQbQHx+bwI66JJaNZ6pXsvO4aQrD9hcHcj9Q0DxDQPr6FEBs02NIt2f53Pvhak8sQssmm6Q+KpR33j5CIVks5Ik63xfS7OxmlCa9SH6vTa8oeswm3COkScJsxYoeLAVvQdSK1mxRiLeFYhmaEMT86XVTJ7qfH734FAF4lC+2i3l1uN9FWwDKaOc5jVNvjh2lyJjLDDyhIE2Qz6G1ION23gAimWz3q+MbU+9Aq+pHWGLrFKS0Xz2qoitB5dY7YtV4cbunNtCobnPsWpHNspncqLalhWZkcjbTRQ3rax9bCRjNW9ub4/ZYOLSqTXpN4WMdRODx4MGkRLd/KmszZ7IqRr3MyeyTSXamQdxEEdGUsiTO5/LKK1ZY2M1LcJoOIus9N67t69JPN+18SNYGltdf1tPTpQvhC4Wxk3x8ujI+8q1TSmsGjThRhcLK9JaUf9gNFLJtj+Tn9+BGTiTO1uHrCg9uTbi9+aFlXDL/EAm96/LcnVoklalN8yzVriMmolszJ/IyuyxbBTPmNoTx5atEbwmKc97rs1cyxIxqrjWk7mVe68jf+7RXclm28wewGu3sPLpYrFwfylmndVkOiMEjmI4NQKYvQABNhr0KJGfql80Lgyg75DOYC1wXaFSYN45aH7Pr7VLY08OjazxSxsaqU2b8j3vFtSGFepO25o5hjxD6yxq4BNNaTECD94SmP4X9qpcyGfIb1vuy+ZyLtdUw59YyWS9Z2sH1JDZI6hG9qaLrVXJntZIJgbiBvSt9vZDZJ7Y0kcMdcIkKv8diDhYY/UjtAZcGBJzuBtvO8smikDHYmsCgdcplVj/4w9e65pTfLJTy6y2+6AICyhc5aoBZg6cyM+ezuWfTGo5tT5QiZDKncOoS9N48+VN2RzYoqPV0a+2gnzwuJS8b41FdueNEupczq715duvnJZBHuTNi2e48LfU9t5XBrqlUvDi8RX5+sUT8j//87fk/KkNauAH07nslOjU46arM/ZgaF1jWPgVeYk3LsgTjzdYdBwMik6jTFdCwxDVhr24xzSlW08P5N/89ilN2B9dXJYLx0fqdOcym8/k5tNDOXl5Q96/ekZOjlJ59fwpSvKvDpR4KyvvwOv9V07JqydG7P+G5fj5VzP5aNsykGMvJkMjw/kspwDIvNkjyzUWM/ni4Y5899ySbG6syP/w/mX1WwZybHmgRFPL/f05iTXxknOs9zJ6ZnumiJVH1PJgZ8rfVg4gsnMwpsAD2ARrBW4StGoUrCkKEDloyadj1VoAFtRXwriYh1iH59lJGq8Jgr/c5q4Z6lZzf+oKCF1B84y9GIh6CsMdrJ0C+uatu0IcHAgzFJGMV8xkRf3P609m8ua5NbLuta925K3VIOubJ1VQBIfCLfulqqwmS6rGwyAN6R4oXNpWJraxD3Ad/QNX9yxnZUveiCZb7Y3krBNmzZQSZOI20VGnTqZlsEFf36PkuVw5d6Zbop10Ip8+PvRO5bnEbOrgpkNm+Wv3kI/15FC+pwT17uUzcqgSG+kfeK2tLPGnfX0x35HFvadevRjJkppCf/n5jqwPM/na8WX5s3euGtCgtu1P7k5oYvzq4UwubE4Jnf6zb79h8Pi4kA/vH8qeOsBtA72IUhxVngslkFo2BpmsriwrgVndDsCJRKUQ4HeLjmdOeFarM9Qhb65YCstj3Zhnc1EfqJKtWWDqyaoS72gwkL+7rU7s5lDOndrkD15fKqP/9uGhIZGuSU4eW+NP+7o12ZLi8TOid6i4TMTzBqO2VN2QPdgVG6OhfLFXy0/vHMg/feWYvP/WFU+JquTffbYtu9OF5W5lqUvZhPv6RDXNxpoZElP4xkqgh6ppVgkM1DRVGQ6NM2bMA4JmTgCzGSILTTDtJlYGLeR1ZR7A9rHSBxz/3395sqd1fj6KG3lvC3a5yfv0kdu6pRBagMusHYAmdVV6RslRrDFWxvn8q225cOGsbB5fYjHclZPLcmYpYTN/ZLg3UdP1v2hzL9te421P8sS750T/+leL8OzB3a5rZvB6CLYtqg1uAxDA1A42EG8jWhFryuezhZ1qMMgdwbFkR5h3J1Qtbi5b3Ijd/zMjgP15Tbj65eWMKQ/7NaLqyvk9NdkqS64ECHFcJfDmEOUJQdQnlZW++h957P3JHApViXLv2aEclNbkA+E0oCIHOq6XN4ZyZS2XYdLIgdrpt/YqeXiAExYCnVGM72tq5x4fpsowtXyhfg20FtKCTqsqX1NGmZVK8NNKDlWav6xaENF/MNHWrOnKytGRB9F2aINHO4fq85SyvDSyNrgRTLMe04u21LcBzI7i8KFqrDNrA27CE53c7kTvr3+/cnzIwCPm+4Vqxy1l6GVd2/Uesi88janLZGrk2eHCEjhT643XeHXtupqJJ5YyJvNu63MBm4OoKuSZ6ZpdVgf57KppyLu7C7mxM7caLSCoMNTj1KsxSzmpJt5q347fwNww/5N6b4AIUxU0mNdMeWBFtTWeCRDgrmqnkc7xxFKuJp3Oe2FdgTZ1z48Nc97jwd68y3j4Q682/SiEIxqL/Dia4FnOrW/3/BE1jffOi3sDeXbjY9l7+kCmG5flrVfO0yS7oUL83WONnD22yvw/wOqpF7sxo8F7vrWdlMCk8DFJff/6l3NlnjvexcYKp0plFjR4yLIWT4/a+K474i5ZajuvhcdEKKf2BwOqR3OqMuYSlR4Rjtg0cECpPFJiwF0OEViLIH2H7MZ5iDwq1WJLCB4qgyJgeDibM49qRa/B32g1Rac4tT7VUKWJ/j1Sv4LOJfqZcZI6WbQuQpfPGCcyRPTNEhSFIdA1GNIOxzh6iLUocS3Qz7if8qyasfoGs9KYA0SAnDvlISvSU7NhTcdzlFALqNiQo1zHM8y8cyerJ2tGuCH9V5Sgk2DEDWF9OLPG46sDa8QHQoT5J0iRUmJEan3PW0zDrKoaMyks/d6ykpHyw46lhKYti0NosqS6XgXRKGg3IEyAWxFDQnwOBZBLQ6sqnaOwT6zBR8lmGiZAiZaisWPS4zEh2OhULJNj1lijFvgWmG+/p0JuVrJdMIguDSW1C/Ls0PBkWedYIAYYpWy0D7NtAPAp/HHMw7w9+B9ermBujHXHTDzXrFgU1EgZ18N6bRMBBFRfLeSDH/87OXn6pJx941tye6eUsxuqAecT+dpqLLPeumrY0pKdvXaGfRlK69DDVsBAkB1aZf/zYmEdYnj0wnBkwSqeY2OlsRgMNsrKnmsvS9YBlaU18nNpELMTpzlb7DkQR1ww66ISyFyqq5SABtYGSgn0WJ5yMJVODJJ5kKYd6MAWRUhVYSWrOZ2QdDmyaytT4xnQHrQEqo6+g9av7URBWCmL1hrmzFVuhyc4UQEHJXlnniIAGVKmZgcKS5gEgfTBkJTGVnYwyq0soGlSLwk+KptGTlWh3JjkFi8KLqVQSowfli40dZdpDr9wqU104IkAQdcgphmEawAe5LHB4UkwxI/jYNpT3KFVKRuqxGR0EFKvH7NuH0Q51DlDTNFvg++BfWVrMKGvxt5v+oxBntKCmC8iFhSWZdX5G3ZqBfjA+hRkfnLAEEgi+mmDwRLLjYQVwJIFAASF9Z1DwSFMWGg0ABmRMvPayogByEKFdOoteP/QK1ReYp0wEMTfHJGfolC5n5Oj3MQbQkIh9NBTbzGVW7/8W1EDQA56JwVF4+c3M7mhJtyPLg9keXVd7m+V7kMlDFQTyPJQBlte+XEoUWJhmLlaImnpjcClTZ/xkwIMVaoIIDTdERex9xGwuniaerHFAdBl0tqkJl2xVtsJH+LdejUn3mdMut7NtZ96xl5tlcVsMMBCN5MdSjzzARI8YUlzRJOLR3gkpqoR6UegkN+NIm/wF/lRH4mXlVvfs8Y721QuQWD6QCrRz4uPIOfQtin1oyUih4LbiAsLKRxti54LONI5rayhX9tiKfJeCWVZdScxsC7fT7Rr06DYqQcnsqQDc4Sbuus5Jn5qAYVNbS2Z0NeuAqIHhvKUI6BjUWwnQ6A+KfWgI7O7UQ8FIuA5Q7m3FzMgqMeEz9Chc2wHDLBgUTiyaGhrho468RGcj8bpPOPMcozsVLay8p7SEbMWIpfi8BUQhyvmC5tTHHU5hH/olaupZFZF2zrMEkZjpOlUZVdaYr6eCsKVVWa9HBzsy86n/0nufnlDLr77Pfn6qxfls8dTNVlj+cGFoWysrsitQzuAC4BQ6V1mo9hoJPZ1gzWFEAzWhCZdAkbLrWUUiLRQVQ6uTns5HeHIe67RVMDRGdACtSUIIr7DlktoEs/iqcZRN6GdHJPwrfkgfaZgBW9QrcTdgehFhoY0TXJ07klddwcWMZ+ub6UH4ocpVX56WRblbCLPg5iyzFu9tnapQetsKespHQx6efoGzBF21amtBW147qw1lpx3rZZKj2K3ROPCgJaV9cQmw6UOntTWYB4EF7FM3fLmgkf6GWtBgz6WQDSUkESGvBgs9fsxhOr9woAy2Rk/VrXa+NGGrd/DphqJNzcRO1PGzzGkVojpC5kWxPPL+YxB5HzQV6a3eoKSRV6GVFWeXdB4qULc2vrodqT7if0jJI8Qx3xh5RB+lGFXiRMZEkozC4ROgWj93tjRE30n+nY0Zrs/f+iF2FYYLOv3RoxHop+DdVW1nnU8fRANIftDfnZwMJZ695Hc+OA/yt72lrz9ne/LeO2CPFLn+OqmmuJRKRdPbMi17Up9zgmL89jlFvSZmJBnsN3jkEisNcFtNB7ZkSMpc4gat/Pw4IQEzdwZy+uBVKTfkrI6EZLdzo5UIkSQCjZnbgc+4XrrOhm6QFnbLZOFb4U1OQc3W3MKS38PjsMHNl4PNB0jL5wjgIEYVGWHLCXpUeP4OGnPhIkItVdov+sYPQgn8Y449OnwjDTpYlKwwY0Q7NydCg0YITBC0mkVjC1NLVof/OQDFnp5WyjTbBkJBesGDcjjP9gwcE5CbE9ByHqW2iHeG5qM5s3YeTpAY0KDUfnEO+tAa7rjW1Zzjg//WdMiO0DLtJxF9nl+KuNetZ1XUxuDsFGhnyTQtlUGskbib2ILO6TeWTVui/Yqq5WKLaRveXKlaX4vL2m7rvIUh8p6PMepwcz8fmwnODCbwfv0Zb20g4DD7xWA/H+/9m5/zjqnZLQqqytLFBI99aHhatR+clszm8rO7jMp9nfkyfWP5P6dm3Lq5AnZeP19OVi9KJdOLMvh4VRePwa0dl1++2guTycF23ZRo6VWIdx4UR6FBwSON1vB/pEe6cbovHlYT2WHL8W+EZCc4oVv0EIMYvriRH5AEkymGKaE+hTszFg3R9e7g/efX08/RSUeWykhnSQ66vIf/DwWnnnJYzPsDJy23zXav8bWLt/qZcjMMAe8pgZaxithCSdmWddlhnlOIGI/ng9StWZcyVAl9tCuzF9iK67Z3FJl/FzUOEvZQZLZ5szcttgBO6L6QbfM0PB6Fkp7JZJc18aCdZnFKJDOU8yoYZjAWLetYIVFZtFzhxqbpqgdCIjcOfaIY2wtduFvZVnuyJKZd/NyysvxPgQL6pvaJFc2TFFiQ0ykS/33GqfIDwnLMitWBIEwlQp7UFRdIDvyBuoMMKuph1AF4x59D2C6cADgZIdxebGhC8fICyyNHkwg/TGvcy+fkd0vPpKHn30oD9RHrZK+IDGjVrpdGtgBzIUyTznekZ3tXVlfX5P+y6/K6GuvyzuvXZK9SSnnl0QuXzqlDFPKb54u5OHuoTLfQG9i/dJ78NVxKiKh9vbwqYRzhCLJk4FVwEL7oAKYR4Kk1oScnRyRFKeDoH0s1iPZuue7fVxH3pm+8hPXrDXVopg9d334g9cznhTF3llTHEWy7GBpD/jtul3WNBFg19M3InyoBFOaeUjTCEGtwlPvmaJeMEWl8voUujTwpdCZlHlXMZnHkhM9szfzDGucC4QShsh8k8V8QiZl2kdIvANrYgFjPxA3uE8XeypJ07Tzs7ZdzJ2rvYeDN3DHKWftCWTdsYrVwlOigp8MntBfg0bqu18C5m68F1uSegPHxpAnIpvQTPAzIxsXA6iOSAUXbMgiYIsoQO1Z6j6kJ826z8Nn0M+q7fQ8EFBuAEztRZORg0WRZ5Vbo8G4qy5mVrMyeeIVr8FPbmtb4kKL/1Fomz73/b/4ryVeHMqdO3dlvP1EZofqz+ztqQm/kLnqn+kwkbMXr8g8XZG10y/Jm1cvM8C8mgU5cX5N9uZBrm0t5N7OhOEIWE01SguyHhG6qq0k8BP5WqHTeJMS7HneM797gfAAjz/HWYxsjm7HC2beeRENWYmRx3nbbJZmFtMiMuuazwOlcFhrr++l1VFXV29xI6tajL04qk114XEYVbAAq/eajtnY0E9WqNHkQaV0r+fxI0sIhIMaeUYENh5AAhnIz2ZpSs94xUkIumlEntoWRo016miTUBlSjOI2e1K/W9Hmb/xgqdrb24JxWnStS08P1vbXzEPzC4AoMhYhlqUNgTGdTA2xTDPHUfy0Ax1zr9+3bqR6zXh+IP3RiOgQCJNR9abpYFIiVZ7EatowMx8PY05NoLCrKgiBCFZ7rEbclWuwMhiCSJmvP1pSYWFMEIIdx4IKW5YX0zxx8AfxvdHAfc3gfcusboooaGwmbwdxJ5aaRH+sKZ5Lxm2eq/MJR5kq8se9dsal/FY1zurSuiydG8jZK68z+Byp3wvzO7DhfEyaQDYI2gggNLx7OJfteS131UTbm9Wyr2vNw8DQuirq002B1gYdGvQedbQd2tP8kDGTZX7WqRVOopdbCrXO80coBmKHNHP+EF6OzU6GeWNoj5lY+DL6WNF2Fu87jEqe0nwOC2jFbiKk7ryXlGCQ4ICCoQUss9cYTGiKFEfnsXikGM/Hv4P3K5DE4FfrXe0tYf38FjyDDBDajGorqmp9ouls0h0obEmjM9rNPH1NNdWkmFAtY7GsIYo1OGGae5J54mVG1U6o14mcMsOPEYG5Ndf7EvOLEz/cN/VxWdeduG2zG9l82sAvnlm7A8/uMKX5f4h8t8gk7gmgpymtm2qBpvNp3hX7QTPR/+nZPrC/BpqUoxx8SW2XuJQ5CsUyq0cKLuzYOB4mcGkJpUCvGs96bhN/a/c7mc2Bfs7sNisWMgCQVDXyj/GCEN0fj3l6HY6rvBcpc2/byeZovN7LhoR+qrnSxfaUiagTXQe6ILre89oYoz17l4KIZurA17E238014Xw69eNtEoZEqqr0qufSBCO0tql+M4co31mzFrgobYJdEjsEW1tPYDhqtXfAIU7Pg5CazsZlAZNI136qag/19VoMRpXZpqj3nJlgPZWRoZ0NMtrZJLbaECPCvE7A7JyZWvd8BEHTXsL3sl7fzKmi8OP5KpqNDQ/OQm/BmUlOmnCGLqFTOEwYjKX2vtVg1IaaYUCpZgfV2hlEBBo8RgGfAs9jUBg5bSFy6Ruz8X3bmCN4KW/KpiURJXYxt86nmR8YRR8GCZkiXX9tjIOBRXT49BiYnQ1mZxwRMEFcSbVe4RZAEhk6CC1CCyG3ebKfdBQ5mmaCAQxEjYZx121QMeqSe1lk6MFeRvHRyRPCwjvGloV1+bS4U+0Z9NU/CvNE4AHsuJ/E13i+2gTB9tROAA+NOf7IFUx8f+Okx/H3E/NdaMUkkZcseJl6knmPuJR0hHbBRTG3sEJq0DQrBVzIMY5U0uTN3ZETMgxjJd4eiQ0FUzN5QCCsZ4gd22/tXpZW2/EhfVWXkfdos1a4jhxFbbsqIbHz+DqcnMYujHb6GHKZWmQNSgHE0W4cBmq93fI2aNKVEUvIu41rm+bVsaFRbfYz+wx4/U7mfRZ4ogAOBp7XjkI1XLijIywqIw6CFTH9FTu3peniUYlzBrpJSptcG7U19m0vukAEjkcAOBTPArGFx5YcBwjeRqk9LLgq7EwgEHrVnvLWlnD48YQ8jQHCIgk8+cCat5hmSpiaUHfVlyniJB6rYjwJjNzYoWCocWcbY4IrCSUrrAoei0UzzJYPAo1nDhFpLexYFLqOCdvopiq84BP8Y7wKB3FSj+XF7ncypIEivxZU0R8krLaIJoQT15q1XpGn9Hj73iZ0pqadCWuFlNCguWttCIM2y4DhD9cKdtyjqq0M2Dj6Oac968sLlCWVrqyABXKpMQqJBovas3SUhao3mBX5MD0qY45NLQYcPsRGgglh4OB1AzW9gthaCbXHLaIOp2dBTyxIPlzyZt0xHVYG3DxRDycUmI0d7PtKH72hB/mgqXjsifoJg5HMdHxscj4Yme9DhrKMB0DD6JPNunjkLKlJg4VGc/AobSyWgyaMOIFaJQ8ZdtCXLNhJB3CES/cXY6h2oIg1Mm4HDqc3ljir/gXACyGyuKBZm8mSCgzvz5wiU9tiK1xvmEOyYJIlYN047RG9irxil34YTV1DCVE2z/4NyN4m0JKzgQu0ZeIHQ1Gj4pDeGodOza1CGKY41hLNLHpDD0dEvoZ23lDrlOSJHVvf2vvo/Q3mgUWQo4ecHXneFvD+g7+whnaaRNqdpE1LJqaUtGyILOuazoCe24CyeEuuPB9Y/MabwYM+2LbXz3ayOCWKF3u0dtpGKYgnpnwe9iLq6nrS7Xs3Zbz7gA8ihJjlHTJqpzIbhMz2UpERJza/q28JbbTZ0jHa6B0YjU4sfaXggj/mYNrCL0rOPPPeaRU1QRtbIfHVzVH1GvPnCqtFbzMDnLmtWXnizr5pGh7JKOZzIQQ+jq1ozZBFu1cUjkAMVg32c5pVB09L6SEmUzvTltYuKzjkbvGv1KHk9gj2tvVWsOcnQt+DzdPRiL22wKi0tfgtqNI0z3nNjdeSmHnXlmnAJOSpcrGVk1vpd1ulaflsk/Eh402pd+Iksu1nfHIvgHYCfPEk3VbrW8/nyNtoFR7f0jkXFm8TL6BL4qg7Qa/dfx4WhmNH/DxXFghW9T8O86jQssOaj4537LSxNwZps6oZpEXTe/fzLGTg3ZuC980IfiRJbKcAGkIaeHIEEdE06dqRWUY4moA6nSOmCZN4sv1IJtuPLY08WPCTOBTsfhbAOaxLdCvjAAtmAJj6Z1C0soNlIQ7poCGCTeJr6GgJJVnqOWc1H0zVm2Ye9bcgYDEOnilgkfbSD9qyWE9jh3Axn8oOqI2zxI8vTLzvW3NUr47kQM8QDt5JJm3TO4jnWxssO4vHYNbFOKaKZkSbDesDzQPMjwGypvZz+jyzORi03xE5Eh2RG5eYsMFRfVhXrAXVPkw7ABo4sU41JX6qeUnoPO5MuEhmUfBnJwQrPHrU9WOwhFjpovitr1k07Snd0pm61Hje0qma+okJQC1FjvYwMmKB3xScBuz7qQshsZwuz6CopM2+SAw0qion2Ljrf/0P/Zof1l2sKvWgdnvaH1J0pJHnAtdpl3VO+pwfGPwM2vC4GKwE1KuxQ86gbyUGEKqOOCbMnik574xnyJam4VogCuebBsZIYlY1ctFA/N5jwHoNG4RXzguHfYU3bSVPm/+D9Bc7ayaxPmzzxmMLlnlA6e61EAhEWeMNSMU5zbLW5GtPXYj8IKPGtVYITjCRMUsc/NxK9b9il+SWXZvZ+ZX1zGBhNIXIUkeDSnPy0eVnPKZESv2wqsR7wzFwCL8ODjhTg8yRxBhbiWfHPdaGwKCGJku6SDljSJWBDhmOCQkGw1cq0fBctp4dDDi22eHY8r7a+pDINKMdZFR7z4a4ayMVe9IsD6miw2ulH5E33G/7mJWFaTwG++Km8w+ZwoIcOHQ/5XHonurvPhWJhwmcufQHQwIK1o+7sV4JYg0OS49htQYEzbjIgqxRF5D9h301LHazE+kI5Ve+H+pfVLOSmQuJd1ZtECuLLME5lqOGLmCmspk7cgwBl5MpYCFgPkwZ6rkABQDmeZUEhzIHwWiXxtSC6dLxlzzxUEiIveW28XnbJrfB8XHSGxk83TXr8OYK7Qlwbf8z3DuvSkeazDRp2lOyyaRRl1pihxb5acZJ7GerJCYRAe/yROajo+mCAwLBJxEcDQIDEvUhc5uTR7Oysv5iwXux4URn8aTKdLDqvpwf/af367ujzgRGmpG5o31+IHFlUHEfPqIuOs1IxFtyM/EadhNy9DBJjjpgtj3tgqF5CbObYU2G38smIKTt82+Ta9sMDAqyzMAYfM/OSm0oNYvJjPldFH5In+ktSR9nCLWFZs4cCdE3Y9ScOWcmJINL6HS0Jv3KDoVC6ms8qGh5ZGnPexTG1K4QTjSx2aZqQSEBTTVIjxq7/EO/hnHsTRIry5lLDDgxJNCqmNPINGXDNsIlhSPWC+Yb4jjMkoHfjkPFEKiHOZ7GltMZgz76vq7SWVQULLAofI9o/uEoG/R2CCHIi9eL14vX/w/4/AXzvHi9eL1gnhevF68XzPPi9eL1gnlevF68XjDPi9eL14vXf/76fwUYAAH4Ms3XO9K4AAAAAElFTkSuQmCC"
                    },
                    logo: {
                        attrs: {
                            x: 25,
                            y: 10,
                            w: 160,
                            h: 100
                        },
                        transform: {
                            /*
                            "x": 20,
                            "y": 5,
                            "size": {
                                "x": 170,
                                "y": 110
                            },
                            "center": {
                                "x": 105,
                                "y": 60
                            },
                            "rotate": 0,
                            "scale": {
                                "x": 1,
                                "y": 1
                            },
                            "translate": {
                                "x": 119,
                                "y": 0
                            },
                            "ratio": 1
                            */
                        },
                        image: 'data:image/jpeg;base64,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'
                    },
                    text: {
                        name: 'Content',
                        font: {
                            family: 'Arial, "Helvetica Neue", Helvetica, sans-serif, "websafe"',
                            color: '#ffffff',
                            header: {
                                size: 24,
                                line: 32
                            },
                            description: {
                                size: 12,
                                line: 16
                            }
                        },
                        placeholder: {
                            hide: false,
                            fill: "black",
                            opacity: 0.7,
                            nostroke: false,
                            strokeColor: 'black',
                            strokeWidth: 1
                        },
                        attrs: {
                            place: {
                                x: 20,
                                y: 128,
                                w: 404,
                                h: 235
                            },
                            html: {
                                x: 20,
                                y: 128,
                                w: 404,
                                h: 235
                            }
                        },
                        transform: {},
                        html: {
                            title: 'Contest Name, Contest',
                            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit, fugit hic tempora dolorem non sunt incidunt velit quam distinctio cum. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit, fugit hic tempora dolorem non sunt incidunt velit quam distinctio cum.',
                        }
                    },
                    prize: {
                        1: {
                            header: {
                                name: 'Prize Header',
                                font: {
                                    family: 'Arial, "Helvetica Neue", Helvetica, sans-serif, "websafe"',
                                    color: '#ffffff',
                                    header: {
                                        size: 18,
                                        line: 20
                                    },
                                    description: {
                                        size: 12,
                                        line: 16
                                    }
                                },
                                placeholder: {
                                    hide: false,
                                    fill: "#000",
                                    opacity: 0.7,
                                    nostroke: false,
                                    strokeColor: 'black',
                                    strokeWidth: 1
                                },
                                title: 'This Month\'s Prizes',
                                description: 'Like our page to win!',
                                transform: {}
                            },
                            image: {
                                name: 'Prize Image',
                                font: {
                                    family: 'Arial, "Helvetica Neue", Helvetica, sans-serif, "websafe"',
                                    color: '#ffffff',
                                    header: {
                                        size: null,
                                        line: null
                                    },
                                    description: {
                                        size: 13,
                                        line: 15
                                    }
                                },
                                placeholder: {
                                    hide: false,
                                    fill: "black",
                                    opacity: 0.7,
                                    nostroke: false,
                                    strokeColor: 'black',
                                    strokeWidth: 1
                                },
                                y: 310,
                                text: 'Enter description prize 1',
                                src: 'http://placehold.it/340x183',
                                transform: {}
                            }
                        },
                        2: {
                            header: {
                                font: {
                                    family: 'Arial, "Helvetica Neue", Helvetica, sans-serif, "websafe"',
                                    color: '#ffffff',
                                    header: {
                                        size: 22,
                                        line: 26
                                    },
                                    description: {
                                        size: 14,
                                        line: 18
                                    }
                                },
                                placeholder: {
                                    hide: false,
                                    fill: "black",
                                    opacity: 0.7,
                                    nostroke: false,
                                    strokeColor: 'black',
                                    strokeWidth: 1
                                },
                                title: {
                                    size: 22,
                                    line: 26,
                                    text: 'This Month\'s Prizes'
                                },
                                description: {
                                    size: 14,
                                    line: 18,
                                    text: 'Like our page to win!'
                                },
                                transform: {}
                            },
                            image: {
                                y: 293,
                                name: 'Prize Image',
                                font: {
                                    family: 'Arial, "Helvetica Neue", Helvetica, sans-serif, "websafe"',
                                    color: '#ffffff',
                                    header: {
                                        size: null,
                                        line: null
                                    },
                                    description: {
                                        size: 12,
                                        line: 15
                                    }
                                },
                                placeholder: {
                                    hide: false,
                                    fill: "black",
                                    opacity: 0.7,
                                    nostroke: false,
                                    strokeColor: 'black',
                                    strokeWidth: 1
                                },
                                attrs: [{
                                    text: 'Enter description prize 1',
                                    src: 'http://placehold.it/203x130'
                                }, {
                                    text: 'Enter description prize 2',
                                    src: 'http://placehold.it/203x130'
                                }],
                                transform: {}
                            }
                        }
                    },
                    selected: null,
                    onEdit: false,
                    draw: null
                }
            }
        });
});