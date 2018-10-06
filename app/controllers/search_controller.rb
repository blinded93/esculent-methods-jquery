# class SearchController < ApplicationController
#   def index
#     # search = SearchService.create(params)
#     # r =  search.valid? ? search.find_results : {search:search}
#
#     redirect_to recipe_search_path({params:{query:params[:query]}})
#     binding.pry
#     # render json: (r[:results] || r),
#     #        meta: (r[:meta] if r[:meta]),
#     #        status: 200
#   end
# end
