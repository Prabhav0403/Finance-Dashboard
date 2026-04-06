class NumMatrix {
    int pre[][];
    public NumMatrix(int[][] matrix) {
        int n=matrix.length;
        int m=matrix[0].length;
        pre=new int[n][m];
        pre[0][0]=matrix[0][0];
        for(int i=1;i<n;i++)
        {
            pre[i][0]=matrix[i][0]+pre[i-1][0];
        }
        for(int j=1;j<m;j++)
        {
            pre[0][j]=matrix[0][j]+pre[0][j-1];
        }
        for(int i=1;i<n;i++)
        {
            for(int j=1;j<m;j++)
            {
                pre[i][j]=matrix[i][j]+pre[i][j-1]+pre[i-1][j]-pre[i-1][j-1];
            }
        }
        for(int i=0;i<n;i++)
        {
            for(int j=0;j<m;j++)
            {
                System.out.print(pre[i][j]+" ");
            }
            System.out.println();
        }
    }
    public static void main(String[] args) {
        int matrix[][]={{3,0,1,4,2},{5,6,3,2,1},{1,2,0,1,5},{4,1,0,1,7},{1,0,3,0,5}};
        NumMatrix obj=new NumMatrix(matrix);
    }
}