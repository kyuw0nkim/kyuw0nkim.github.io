# Publications — 엑셀로 관리하기

논문 목록은 이 폴더의 **`publications.xlsx`** 에서 관리합니다.
사이트 코드(`src/data/...`)를 직접 고칠 필요가 없습니다.

## 업데이트 방법 (3단계)

1. **`data/publications.xlsx` 를 열어** 행을 추가/수정합니다. (한 행 = 논문 하나)
2. 터미널에서 프로젝트 폴더로 이동해 아래를 실행합니다:
   ```
   npm run gen:pubs
   ```
   → `src/data/publications.generated.ts` 가 엑셀 내용대로 다시 만들어집니다.
3. 평소처럼 커밋 & 푸시하면 GitHub Actions 가 자동으로 빌드·배포합니다:
   ```
   git add -A
   git commit -m "Update publications"
   git push
   ```

> 참고: `npm run build` 를 하면 빌드 직전에 자동으로 `gen:pubs` 가 한 번 더 실행되므로,
> 엑셀과 사이트가 항상 일치합니다. (2단계를 깜빡해도 배포 시 반영됨)

## 열(column) 설명

| 열           | 필수  | 설명                                                                       |
| ----------- | --- | ------------------------------------------------------------------------ |
| `id`        | ✅   | 고유 식별자. 한 번 정하면 바꾸지 마세요 (프로젝트의 relatedPublications 등이 참조). 예: `p2026-c2` |
| `title`     | ✅   | 논문 제목                                                                    |
| `year`      | ✅   | 연도 (숫자). 사이트에서 연도별로 묶여 표시됩니다                                             |
| `type`      | ✅   | `Conference` / `Workshop` / `Journal` / `Preprint` 중 하나                  |
| `authors`   |     | 저자. **세미콜론(`;`)** 으로 구분. 예: `Kyuwon Kim; Hyo-Jeong So`                   |
| `venue`     |     | 게재처. 예: `LAK 2026`, `교육정보미디어연구, v.31, no.5`                              |
| `topics`    |     | 연구 주제. `;` 로 구분. 필터에 사용됨. 예: `AIED; Learning Analytics`                  |
| `tags`      |     | 태그. `;` 로 구분                                                             |
| `pdf`       |     | PDF 링크                                                                   |
| `doi`       |     | DOI 링크                                                                   |
| `arxiv`     |     | arXiv 링크                                                                 |
| `acmdl`     |     | ACM Digital Library 링크                                                   |
| `website`   |     | 프로젝트/논문 웹사이트 링크                                                          |
| `award`     |     | 수상 내역. 예: `최우수논문상`, `Best Poster Design Award`                           |
| `thumbnail` |     | `public/thumbnails/` 안의 이미지 파일명. 예: `pic.C.FLIP.png`                     |

### 규칙
- **행 순서 = 같은 연도 안에서의 표시 순서** 입니다. 최신 논문을 위로 두세요.
- 값이 여러 개인 열(`authors`, `topics`, `tags`)은 세미콜론 `;` 으로 구분합니다.
- 빈 칸은 그냥 비워두면 됩니다 (자동으로 생략됨).
- `id` 가 비었거나 중복이거나, `type` 값이 잘못되면 `npm run gen:pubs` 가 어느 행이 문제인지 알려주고 멈춥니다.

### 썸네일 추가
1. 이미지를 `public/thumbnails/` 에 넣습니다 (권장 비율 3:2, 예 600×400px).
2. 엑셀의 `thumbnail` 열에 파일명을 적습니다.
