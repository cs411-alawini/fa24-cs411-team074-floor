import pandas as pd
from typing import List
import csv


def format_df_to_csv(
    df: pd.DataFrame, pks: List[str], attribute_order: List[str], path: str
):
    df = df[attribute_order]
    df['tmp'] = [0 for _ in range(len(df))]
    df.to_csv(path_or_buf=path, header=False, index=False, na_rep='NULL')
    # df.set_index(pks).to_csv(path)
    # with open(path, 'r') as f:
    #     lines = f.readlines()
    #     print(lines)
    #     with open(path, 'w') as fw:
    #         for l in lines[1:]:
    #             fw.write(l)
    
    
