class IngredientsController < ApplicationController
    def search
      results = IngredientService.parse(ingredient_params)
      ingredient_ids = results[:ingredients].collect(&:id)

      meta, recipes = pagy(Recipe.with_ingredients(ingredient_ids),
                           {  items: 8,
                              query: params[:query],
                            results: results } )
      render json: recipes,
             meta: meta,
             status: 200
    end

    private
      def ingredient_params
        params.permit(:query => [])
      end
end